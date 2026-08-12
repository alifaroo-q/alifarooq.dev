# Prose

Rules for the words a reader sees: headings, standfirsts, page copy, MDX case
studies, link labels, meta descriptions. Not code comments, not commit
messages. Those two are for us, and they can be as long as they need to be.

`AGENTS.md` says how the page looks. This says how it sounds.

## The register the site already has

The case studies set it, and they are the only prose here nobody has
complained about. A sample from `the-money-rule-in-the-database-not-the-service.mdx`:

> The loss that happened was quiet. 5sim, the number provider, quotes prices to
> four decimal places. We stored money in cents. A cost of $0.0769 was written
> down as 8c — a four percent error, going straight into the account we book
> the cost of goods against.

Four sentences. Lengths 6, 12, 5, 30. One "I" nearby, real numbers, no twist at
the end. Everything below is an attempt to say why that works so the next page
can do it on purpose.

## The rules

### 1. First person, and one person

The site is one engineer arguing about his own decisions. Write "I put it in
the arguments", not "the handle was put in the arguments".

Dropping the "I" is the single biggest cause of the robot voice. `/stack` at
commit `7b00857` had "I" in two of twelve entries; the version before it had it
in eleven. The two-of-twelve version is the one that reads as though a
committee wrote it about somebody else.

### 2. One point per block, and do not turn it

The shape is: *X is not the hard part — Y is.* Also *X rather than Y*, *never
X, it is Y*, and a colon that exists to deliver a reversal.

Used once, it lands. Used every time, the reader stops believing any of them.
Counted in `src/lib/stack.ts` at `7b00857`: ten of the twelve entries carried
one. Four "rather than", four "never", three em dashes, six colons.

A page gets one turn. Spend it where the point is worth it.

### 3. Vary the length

Same twelve entries, sentence lengths in words:

```
[6, 26]  [6, 26]  [10, 23]  [3, 23, 13]  [13, 33]  [6, 39]
[7, 29]  [9, 27]  [5, 31]   [7, 6, 19]   [10, 20, 26]  [7, 19, 15]
```

Every one opens with a fragment of three to thirteen words, then one sentence
of nineteen to thirty-nine. Twelve identical bars of music. That is the sound
of a template, and a reader hears it by the fourth item even if he cannot name
it.

Aim for a mix inside any 200 words: something under ten, most in the middle,
one long. Some entries should be a single plain sentence. Some should be three.

### 4. A number beats an adjective

The case studies carry twenty-seven modules, thirty-four files, 915 calls,
$0.0769 booked as 8c, seventy-one test files, a seven-day watch renewed every
six hours. That is why they read as though somebody was there.

If a sentence has no number in it, check whether it is making a claim that a
number would settle. Never invent one.

### 5. Nothing should sound quotable

"A key nobody owns is a key nobody dares delete two years later." That is a
fortune cookie. It is also unfalsifiable, which is why it feels like filler
even though it scans well.

Test: if the line would work as a caption under a stranger's photo, cut it and
say the plain thing instead.

### 6. Read it aloud

Paul Graham's test: *is this how I would say it to a friend?* If a clause makes
you stumble out loud, it will make a reader stumble silently.

### 7. Be plain, and be short

The web reading research is old and still true. Readers scan; concise, scannable,
factual copy measured 124% better on usability than the promotional version of
the same page, and the concise change alone was worth 58%.

Cut every word that can go. Prefer the short word. This is the house rule in
`~/.claude/CLAUDE.md` and it applies double on a page somebody landed on by
accident.

### 8. Words we do not use

No level words: advanced, expert, seasoned, passionate, deep expertise, years
of. No marketing words: leverage, robust, seamless, powerful, cutting-edge,
best-in-class, journey, unlock. No inflation: pivotal, crucial, key, vital,
testament, underscores, showcases, highlights, landscape, tapestry.

No "-ing" tails bolted on to add depth: *…, ensuring reliability*,
*…, reflecting a broader shift*.

### 9. Punctuation budget

Two different em dashes exist and only one is a problem.

The **aside** is fine, and the case studies are full of it: "a cost of $0.0769
was written down as 8c — a four percent error, going straight into the account
we book the cost of goods against". That is an appositive. It adds a fact. Long
prose can carry several and the money-rule case study carries ten without
sounding written by a machine.

The **pivot** is the one to cut. It sets up a reversal or delivers a punchline:
"a queue relocates the failure — it does not remove it". That dash is doing
rule 2's job, and rule 2 already said no.

So: in a case study or a long section, use the aside freely and the pivot never.
In short copy — headings, standfirsts, share cards, pitches, microcopy — use
neither. There is no room to earn one.

Straight quotes in prose. Curly quotes only where the typography is the point,
as in the `"works on my machine"` line.

Headings are sentence case. No emoji. No bold used to shout.

### 10. Links say what is behind them

"See where the handle goes →" and not "Read more". The label is a promise about
the next page.

## Measuring it

`pnpm prose` counts all of the above across every reader-facing string on the
site. It strips comments first, so this repo's JSDoc never lands in the numbers.

It reports rather than gates, because every rule here except one is a judgement
call: only a person can say whether an em dash is an aside or a pivot. The
exception is the banned word list, which exits 1.

Read the counts, do not chase them. The three case studies come out at 1, 2 and
4 reversals and all of them are fine. What the numbers are for is the pattern a
reader feels and cannot name: `uniformity` is the field that caught /stack, where
twelve entries shared one rhythm.

## The checklist

Before shipping copy, run it:

1. Is there an "I" in it, where there should be?
2. How many entries turn on a reversal? More than one is too many.
3. Write down the sentence lengths. Do they vary?
4. Any number I could use and am not?
5. Any line that sounds like a quotation? Cut it.
6. Read it out loud. Where did I stumble?
7. What can come out with no loss?

## Sources

- [NN/g — Concise, SCANNABLE, and Objective](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/)
- [NN/g — Be Succinct!](https://www.nngroup.com/articles/be-succinct-writing-for-the-web/)
- [Google developer documentation style guide — Voice and tone](https://developers.google.com/style/tone)
- [Paul Graham — Write Like You Talk](https://paulgraham.com/talk.html)
- [Wikipedia — Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
