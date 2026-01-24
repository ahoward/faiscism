# Plan: Port faiscism to Custom Ruby SSG with ro Data Layer

## Overview

Replace 11ty/JavaScript implementation with a pure HTML, zero-JS static site using:
- `ro` gem for file-based data layer
- Custom Ruby SSG (mirroring drawohara.io patterns)
- Pre-generated HTML pages for every possible path through the quiz

## Phase 1: Extract Data to ro Format

### Data Ontology

```
public/ro/
├── site/
│   └── config.yml                    # Site-wide config (title, tagline, etc.)
│
├── paths/
│   ├── chain.yml                     # Path metadata
│   ├── chain/body.md                 # Path description
│   ├── pillars.yml
│   ├── pillars/body.md
│   ├── mirror.yml
│   └── mirror/body.md
│
├── questions/
│   ├── chain-01.yml                  # Question data (text, options, scores)
│   ├── chain-01/body.md              # Educational content
│   ├── chain-02.yml
│   ├── chain-02/body.md
│   ├── ...
│   ├── pillars-01.yml
│   ├── pillars-01/body.md
│   ├── ...
│   ├── mirror-01.yml
│   └── mirror-01/body.md
│
├── results/
│   ├── sleepwalker.yml               # Result type metadata
│   ├── sleepwalker/body.md           # Full description
│   ├── skeptic.yml
│   ├── skeptic/body.md
│   ├── participant.yml
│   ├── participant/body.md
│   ├── architect.yml
│   ├── architect/body.md
│   ├── witness.yml
│   ├── witness/body.md
│   ├── resister.yml
│   └── resister/body.md
│
└── dimensions/
    ├── creation.yml                  # Dimension metadata (for chain)
    ├── consumption.yml
    ├── feedback.yml
    ├── pattern.yml                   # For pillars
    ├── structural.yml
    ├── centralization.yml
    ├── filtering.yml                 # For mirror
    ├── agency.yml
    └── systemic.yml
```

### Question YAML Structure

```yaml
# public/ro/questions/chain-01.yml
---
path: chain
number: 1
stage: creation
text: "When you write something important—an email, a post, a document—do you use AI assistance?"
options:
  - label: "Always or almost always"
    scores: { creation: 0 }
  - label: "Sometimes"
    scores: { creation: 1 }
  - label: "Rarely"
    scores: { creation: 2 }
  - label: "Never"
    scores: { creation: 3 }
```

Educational content goes in `public/ro/questions/chain-01/body.md`.

### Result Type YAML Structure

```yaml
# public/ro/results/sleepwalker.yml
---
name: "The Sleepwalker"
summary: "Uses AI heavily, trusts implicitly, hasn't considered systemic effects."
hook: "I took the mirror test. I'm a Sleepwalker. Are you?"
threshold: 0.25
```

Full description in `public/ro/results/sleepwalker/body.md`.

---

## Phase 2: Pure HTML Quiz Architecture (Zero JS)

### Key Insight

Each answer links directly to the next question OR result, encoding state in the URL.

### URL Structure

```
/                                     # Landing page
/chain/                               # Path intro
/chain/1/                             # Question 1 (initial)
/chain/1/a/2/                         # Question 2 after answering 'a' to Q1
/chain/1/a/2/b/3/                     # Question 3 after answering 'a','b' to Q1,Q2
...
/chain/1/a/2/b/3/c/4/d/5/a/6/b/7/c/8/d/9/a/10/b/result/
                                      # Final result after all 10 answers
```

Each URL segment encodes: `{question}/{answer}/`

### How It Works

**Question Page (e.g., `/chain/1/a/2/`):**
- Shows question 2
- Each answer option is a link to the next question with that answer appended
- Link format: `/chain/1/a/2/{answer}/3/` for options a,b,c,d

**Final Question:**
- Each answer links directly to the calculated result page
- Result is computed at build time from the accumulated answer path

### Pre-Generation Math

- 10 questions per path
- 4 options per question
- Total unique paths per quiz: 4^10 = 1,048,576 pages

**This is too many.** We need a different approach.

### Revised Architecture: Score-Based URLs

Instead of encoding every answer, encode cumulative **dimension scores**.

```
/chain/1/                             # Q1, no scores yet
/chain/2/?c=0&f=0                     # Q2, creation=0, feedback=0 (implicit)
/chain/3/?c=1&f=0                     # Q3, creation=1
...
/chain/result/?c=5&f=7&s=3            # Final result with scores
```

**Problem:** Query params don't work for pure static HTML without JS.

### Revised Architecture: Path-Encoded Scores

Encode scores directly in the path:

```
/chain/1/                             # Q1
/chain/2/c0/                          # Q2, creation score = 0
/chain/3/c1/                          # Q3, creation score = 1
/chain/4/c1-f0/                       # Q4, creation=1, feedback=0
...
/chain/result/c5-f7-s3/               # Result with final scores
```

### Score Permutation Math

- 3 dimensions per path
- Each dimension: 0-30 points possible (10 questions × max 3 points)
- But questions only affect specific dimensions

Actual score ranges (based on question data):
- Chain: creation 0-9, consumption 0-12, feedback 0-12
- Let's simplify: bucket into low/medium/high per dimension

**Final result pages:** 3 dimensions × 3 levels = 27 permutations per path = 81 total result pages

**Question pages with score states:**
- Q1: 1 state (no prior answers)
- Q2: 4 states (4 possible Q1 answers affecting dimension scores)
- Q3: up to 16 states...

This explodes quickly. Need another approach.

### Simplest Viable Architecture

**Approach: Answer-tracking in URL, compute result client-side... wait, no JS.**

**Actual Simplest: Encode dimension levels in path**

After each question, track only the **current level** (low/medium/high) for each dimension.

```
/chain/1/                             # Start
/chain/2/l-l-l/                       # All dimensions low
/chain/3/l-l-l/                       # Still all low
/chain/3/m-l-l/                       # Dimension 1 now medium
...
```

With 3 dimensions × 3 levels = 27 possible states at each question.
10 questions × 27 states = 270 question pages per path.
3 paths × 270 = 810 question pages.
Plus 81 result pages.
Plus 4 landing/intro pages.
**Total: ~900 pages** — perfectly manageable.

### Final URL Structure

```
/                                     # Home
/{path}/                              # Path intro (chain, pillars, mirror)
/{path}/q/{n}/{d1}-{d2}-{d3}/         # Question n with dimension levels
/{path}/result/{d1}-{d2}-{d3}/        # Final result
```

Where d1, d2, d3 are: `l` (low), `m` (medium), `h` (high)

Example:
```
/chain/q/1/l-l-l/                     # Question 1, all low (starting state)
/chain/q/5/m-l-l/                     # Question 5, dim1=medium, others low
/chain/result/h-m-l/                  # Result: high, medium, low
```

### Question Page Rendering

Each question page shows:
1. The question text
2. Four answer options, each as a `<a href>` link
3. Educational content (if any) shown inline after question

Each answer link computes the new dimension levels based on that answer's scores and links to:
- Next question page with updated levels, OR
- Result page if this is question 10

---

## Phase 3: Ruby SSG Implementation

### Directory Structure

```
faiscism/
├── public/ro/                        # Data layer (Phase 1)
├── lib/
│   └── site.rb                       # Site generator
├── views/
│   ├── layout.erb                    # Base HTML layout
│   ├── home.erb                      # Landing page
│   ├── path.erb                      # Path intro
│   ├── question.erb                  # Question page
│   └── result.erb                    # Result page
├── script/
│   ├── build                         # Build static site
│   └── server                        # Dev server
├── build/                            # Generated HTML output
├── Gemfile
└── config.ru
```

### Build Process

1. Load all ro data
2. Generate home page
3. For each path:
   - Generate path intro page
   - For each question (1-10):
     - For each dimension state (27 combinations):
       - Generate question page with links to next states
   - For each result state (27 combinations):
     - Generate result page
4. Copy static assets

### Scoring Logic

**Dimension Level Calculation:**
- Track running score per dimension
- Map to level: score <= 3 → low, <= 6 → medium, else high
- (Thresholds adjusted per dimension based on actual max scores)

**Result Type Calculation:**
- Sum dimension level values (low=0, medium=1, high=2)
- Ratio = sum / 6 (max possible)
- Map ratio to result type using thresholds from results.json

---

## Execution Order

### Step 1: Extract ro data (FIRST - for your review)
- Create public/ro directory structure
- Convert all JSON to YAML + markdown
- Verify data integrity

### Step 2: Build Ruby SSG (after ro data approved)
- Set up Gemfile with ro, kramdown, etc.
- Create lib/site.rb with core logic
- Create ERB templates
- Create build script

### Step 3: Generate and deploy
- Run build
- Verify output
- Update GitHub Actions for Ruby build
- Deploy

---

## Questions Before Proceeding

1. Is the URL structure `/{path}/q/{n}/{d1}-{d2}-{d3}/` acceptable?
2. Should educational content appear inline on question pages, or on a separate "learn more" page?
3. Should we keep OG tags for social sharing on result pages?
4. Any preferences on the visual design/CSS?
