import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from generate_articles import build_learning, enrich, get_category_for_today, keywords, reading_level


class GeneratorTests(unittest.TestCase):
    def test_keywords_skip_stop_words(self):
        self.assertEqual(keywords("Watch: Starship splashdown ends in fireball"), ["Watch", "Starship", "splashdown", "ends"])

    def test_reading_level_is_valid(self):
        self.assertIn(reading_level("The cat sat. It was fun."), {"Easy", "Medium", "Challenging"})

    def test_learning_avoids_recent_words(self):
        first = build_learning("2026-01-01", "World", "Title here", "Summary.")
        avoid = {w["word"] for w in first["vocabulary"]}
        second = build_learning("2026-01-02", "World", "Title here", "Summary.", avoid)
        self.assertFalse(avoid & {w["word"] for w in second["vocabulary"]})
        self.assertEqual(len(second["vocabulary"]), 8)

    def test_recent_categories_move_to_back(self):
        order = get_category_for_today({"Technology", "World"})
        self.assertTrue(set(order[-2:]) <= {"Technology", "World"} or order.index("Technology") > 1)

    def test_enrich_is_idempotent(self):
        a = {"date": "2026-01-01", "category": "Science", "title": "T", "summary": "S."}
        self.assertTrue(enrich(a))
        self.assertFalse(enrich(a))


if __name__ == "__main__":
    unittest.main()
