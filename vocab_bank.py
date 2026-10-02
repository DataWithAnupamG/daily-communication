"""Original learning content: advanced words, idioms and category angles."""

WORDS = [l.split("|") for l in """mitigate|verb|to make something less harmful or severe|Cities plant trees to mitigate rising heat.
scrutiny|noun|close and critical examination|The plan faced intense scrutiny from experts.
unprecedented|adj|never having happened before|The storm caused unprecedented damage.
resilient|adj|able to recover quickly from difficulty|Small shops proved resilient during the downturn.
ambiguous|adj|open to more than one meaning|The statement was deliberately ambiguous.
advocate|verb|to publicly support an idea or cause|She advocates for cleaner public transport.
pragmatic|adj|practical rather than idealistic|He took a pragmatic approach to the budget.
fluctuate|verb|to rise and fall irregularly|Fuel prices fluctuate throughout the year.
comprehensive|adj|complete and covering everything important|They published a comprehensive safety report.
exacerbate|verb|to make a problem worse|Delays only exacerbated the confusion.
viable|adj|able to work successfully|Solar power is now a viable option for homes.
consensus|noun|general agreement among a group|There is no consensus on the best solution.
implication|noun|a likely effect or consequence|The law has serious implications for startups.
controversial|adj|causing public disagreement|The decision proved highly controversial.
transparent|adj|open and easy to understand or check|The company promised to be transparent about costs.
inevitable|adj|certain to happen; unavoidable|Some delays were inevitable.
substantial|adj|large in amount or importance|The firm made a substantial investment.
undermine|verb|to weaken gradually|Constant changes undermine trust in the system.
leverage|verb|to use something to maximum advantage|Teams leverage data to make faster decisions.
nuanced|adj|showing subtle differences and detail|It is a nuanced issue with no easy answer.
escalate|verb|to become more intense or serious|Tensions began to escalate overnight.
accountable|adj|responsible and expected to explain actions|Leaders must be accountable to the public.
disrupt|verb|to interrupt or change how something normally works|New apps disrupted the taxi industry.
bolster|verb|to strengthen or support|The news bolstered investor confidence.
outweigh|verb|to be greater in importance than|The benefits outweigh the risks.
momentum|noun|strength or speed gained as something develops|The campaign is gaining momentum.
scepticism|noun|a doubting attitude toward claims|Experts met the claim with scepticism.
allegedly|adv|said to be true but not proven|The firm allegedly ignored the warnings.
repercussion|noun|an indirect, often unwelcome result|The move had wide repercussions.
incentive|noun|something that motivates action|Tax breaks are an incentive to go electric.
vulnerable|adj|easily harmed or affected|Older people are most vulnerable to the heat.
prospect|noun|the possibility of something happening|The prospect of a deal looks uncertain.""".split("\n")]

IDIOMS = [l.split("|") for l in """back to square one|to have to start again from the beginning|The test failed, so we are back to square one.
the tip of the iceberg|a small visible part of a much bigger problem|These delays are just the tip of the iceberg.
move the goalposts|to change the rules so success is harder|They moved the goalposts after we agreed.
a double-edged sword|something with both good and bad effects|Social media is a double-edged sword.
on the same page|sharing the same understanding|Let's make sure the team is on the same page.
raise the bar|to set a higher standard|The new model raises the bar for phones.
read between the lines|to find the hidden meaning|If you read between the lines, prices will rise.
a blessing in disguise|something that seems bad but turns out good|Losing that deal was a blessing in disguise.""".split("\n")]

ANGLES = {
    "Technology": "Tech stories are about trade-offs: speed against safety, convenience against privacy. Ask who gains, who is left out, and what could go wrong.",
    "World": "World news is easier to explain when you separate the facts, the causes, and the reactions. Name the people involved before sharing an opinion.",
    "Business": "Business stories follow money and incentives. Ask who pays, who profits, and how ordinary customers or workers feel the effect.",
    "Science": "Science stories show how discovery meets real-world limits. Explain what was tried, what happened, and what it teaches us next.",
    "Health": "Health stories affect daily habits. Separate what is proven from what is still uncertain, and think about who is most affected.",
    "India": "Stories about India often connect local life with national policy. Think about how the news touches families, cities, and work.",
    "Entertainment": "Culture stories reveal what people value. Explain why the story is popular and what it says about society today.",
    "Top Stories": "Top stories are chosen because many people care. Explain the headline simply first, then say why it matters now.",
}

EXTRA_QUESTIONS = [
    "What is the strongest argument for and against what happened?",
    "If you were advising the people involved, what would you tell them?",
    "How might this story look different in ten years?",
]
