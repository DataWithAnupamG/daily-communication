import html
import json
import random
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

from vocab_bank import WORDS, IDIOMS, ANGLES, EXTRA_QUESTIONS

ARTICLES_FILE = Path("data/articles.json")

RSS_FEEDS = {
    "World": "https://feeds.bbci.co.uk/news/world/rss.xml",
    "Technology": "https://feeds.bbci.co.uk/news/technology/rss.xml",
    "Business": "https://feeds.bbci.co.uk/news/business/rss.xml",
    "Science": "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    "Health": "https://feeds.bbci.co.uk/news/health/rss.xml",
    "Entertainment": "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
    "India": "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml",
    "Top Stories": "https://feeds.bbci.co.uk/news/rss.xml",
}

CATEGORY_ORDER = [
    "Technology",
    "World",
    "Business",
    "Science",
    "Health",
    "India",
    "Entertainment",
    "Top Stories",
]


def load_articles():
    if not ARTICLES_FILE.exists():
        return []
    with open(ARTICLES_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_articles(articles):
    with open(ARTICLES_FILE, "w", encoding="utf-8") as file:
        json.dump(articles, file, indent=2, ensure_ascii=False)


def fetch_feed(url):
    request = Request(
        url,
        headers={"User-Agent": "DailyCommunicationPractice/1.0"},
    )
    with urlopen(request, timeout=20) as response:
        return response.read()


def clean_text(text):
    if not text:
        return ""
    text = html.unescape(text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def parse_feed(xml_data, category):
    root = ET.fromstring(xml_data)
    results = []

    for item in root.findall(".//item"):
        title = item.findtext("title")
        link = item.findtext("link")
        guid = item.findtext("guid")
        description = item.findtext("description")
        pub_date = item.findtext("pubDate")

        if not title or not link:
            continue

        title = clean_text(title)
        description = clean_text(description)

        if len(description) > 500:
            description = description[:497] + "..."

        results.append(
            {
                "category": category,
                "title": title,
                "url": link.strip(),
                "guid": guid.strip() if guid else link.strip(),
                "summary": description,
                "published": pub_date or "",
            }
        )

    return results


def get_recent_articles():
    all_articles = []

    for category, feed_url in RSS_FEEDS.items():
        try:
            print(f"Fetching {category}...")
            xml_data = fetch_feed(feed_url)
            all_articles.extend(parse_feed(xml_data, category))
        except Exception as error:
            print(f"Could not fetch {category}: {error}")

    return all_articles


def get_category_for_today(recent=()):
    day_of_year = datetime.now(timezone.utc).timetuple().tm_yday
    preferred_index = day_of_year % len(CATEGORY_ORDER)
    preferred_category = CATEGORY_ORDER[preferred_index]

    order = [preferred_category] + [
        category for category in CATEGORY_ORDER
        if category != preferred_category
    ]
    # Categories used in the last two articles go to the back (stable sort).
    return sorted(order, key=lambda category: category in recent)


def build_questions(category):
    questions = [
        "Can you explain this article in your own words?",
        "What do you think about this topic?",
        "How could this affect ordinary people's daily lives?",
    ]

    if category == "Technology":
        questions[2] = "How might this change the way people use technology?"
    elif category == "Business":
        questions[2] = "How could this affect businesses or jobs?"
    elif category == "Health":
        questions[2] = "Could this change people's daily habits or health decisions?"
    elif category == "India":
        questions[2] = "How might this matter to people living in India?"
    elif category == "Science":
        questions[2] = "Why do you think this scientific development matters?"

    return questions + EXTRA_QUESTIONS


STOP = set("a an the of to in on for and or with at by from is are was were be as it its this that after over into new says say will has have".split())


def keywords(title, n=4):
    seen, out = set(), []
    for w in re.findall(r"[A-Za-z][A-Za-z'-]{3,}", title):
        if w.lower() not in STOP and w.lower() not in seen:
            seen.add(w.lower())
            out.append(w)
    return out[:n]


def reading_level(text):
    words = re.findall(r"[A-Za-z']+", text)
    if not words:
        return "Easy"
    sentences = max(1, len(re.findall(r"[.!?]+", text)))
    syllables = sum(max(1, len(re.findall(r"[aeiouy]+", w.lower()))) for w in words)
    score = 206.835 - 1.015 * len(words) / sentences - 84.6 * syllables / len(words)
    return "Easy" if score >= 70 else "Medium" if score >= 50 else "Challenging"


def recent_info(articles, n=2):
    latest = sorted(articles, key=lambda a: a["date"], reverse=True)[:n]
    words = {w["word"] for a in latest for w in a.get("vocabulary", []) if isinstance(w, dict)}
    return words, [a["category"] for a in latest]


def build_learning(date, category, title, summary="", avoid=()):
    rng = random.Random(date)
    pool = [w for w in WORDS if w[0] not in avoid]
    if len(pool) < 8:
        pool = WORDS
    idiom = rng.choice(IDIOMS)
    return {
        "angle": ANGLES.get(category, ANGLES["Top Stories"]),
        "level": reading_level(summary or title),
        "keywords": keywords(title),
        "vocabulary": [
            {"word": w, "pos": p, "meaning": m, "example": e}
            for w, p, m, e in rng.sample(pool, 8)
        ],
        "idiom": {"phrase": idiom[0], "meaning": idiom[1], "example": idiom[2]},
    }


def enrich(article):
    """Upgrade older entries so every article has the rich learning fields."""
    vocab = article.get("vocabulary", [])
    if vocab and isinstance(vocab[0], dict) and "level" in article:
        return False
    article.update(build_learning(article["date"], article["category"], article["title"], article.get("summary", "")))
    article["questions"] = build_questions(article["category"])
    return True


def create_article(feed_article, today, avoid=()):
    return {
        "date": today,
        "source": "BBC News",
        "category": feed_article["category"],
        "title": feed_article["title"],
        "summary": (
            feed_article["summary"]
            or "Read the original BBC article to learn more about this topic."
        ),
        "url": feed_article["url"],
        "published": feed_article["published"],
        "opinionPrompt": (
            "After reading the article, state your opinion clearly. "
            "Give one reason and one example to support your point."
        ),
        "questions": build_questions(feed_article["category"]),
        **build_learning(today, feed_article["category"], feed_article["title"], feed_article["summary"], avoid),
    }


def main():
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    articles = load_articles()
    if any([enrich(a) for a in articles]):
        save_articles(articles)

    if any(article.get("date") == today for article in articles):
        print("Today's article already exists.")
        return

    recent = get_recent_articles()

    if not recent:
        raise RuntimeError("No BBC articles could be fetched.")

    avoid_words, recent_categories = recent_info(articles)
    used_urls = {article.get("url") for article in articles}
    selected = None

    for category in get_category_for_today(recent_categories):
        candidates = [
            article
            for article in recent
            if article["category"] == category
            and article["url"] not in used_urls
        ]
        if candidates:
            selected = random.choice(candidates)
            break

    if selected is None:
        candidates = [
            article for article in recent
            if article["url"] not in used_urls
        ]
        if candidates:
            selected = random.choice(candidates)

    if selected is None:
        print("No new BBC article found.")
        return

    new_article = create_article(selected, today, avoid_words)
    articles.append(new_article)
    articles.sort(key=lambda article: article["date"], reverse=True)
    save_articles(articles)

    print("Created today's article:")
    print(new_article["title"])
    print(new_article["url"])


if __name__ == "__main__":
    main()
