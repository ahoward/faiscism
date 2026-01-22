# faiscism.org - Project Roadmap

## Vision

An educational decision-tree website that helps people understand how their relationship with AI and modern technology may be facilitating fascism—not through obvious propaganda, but through invisible filtering that shapes thought.

**Core Insight:** The danger isn't AI generating fascist content—it's AI invisibly filtering the information landscape in ways that make fascist thinking feel natural, inevitable, or "just common sense."

---

## Tagline Options

- *"How your technology choices shape the world"*
- *"Take the mirror test"*
- *"What aren't you seeing?"*

---

## Site Structure

### Landing Page

Three hand-drawn doorways/paths, each with a simple question:

| Path | Name | Hook | Duration |
|------|------|------|----------|
| A | The Chain | *"Where does your content go?"* | ~5-7 min |
| B | The Pillars | *"What does history teach us?"* | ~8-10 min |
| C | The Mirror | *"What aren't you seeing?"* | ~5-7 min |

**Unifying statement:**
> "These paths explore the same territory from different angles. Take one, or take all three. Your results combine into a single portrait."

---

## Design Philosophy

### Visual Language
- Black and white only
- Hand-drawn, outline-only illustrations
- Stark, simple, intentionally unpolished
- No stock photos, no gradients, no color
- Feels like a zine, not a tech product

### Interaction Design
- Multiple choice questions only
- One question per screen
- Educational content between questions
- No progress bars (reduces gaming)
- No back button (commit to answers)

### Tone
- Direct, not preachy
- Questions, not accusations
- Historical grounding, not hysteria
- Invites reflection, not guilt

---

## Three Paths

### Path A: "The Amplification Chain"
Traces how individual choices aggregate through AI's filtering mechanisms.

**Stages:**
1. Creation - What you make/share
2. Curation - What algorithms surface
3. Consumption - What you see/believe
4. Action - What you do as a result
5. Feedback - How the system learns from you

**Thesis:** Small individual choices aggregate into systemic effects.

---

### Path B: "The Five Pillars"
Maps historical fascist mechanisms to modern tech equivalents.

**Pillars:**
1. Narrative Control → Algorithmic curation
2. In-group/Out-group → Recommendation bubbles
3. Truth Erosion → AI as "neutral arbiter"
4. Surveillance/Compliance → Behavioral nudging
5. Centralized Power → Platform monopolies

**Thesis:** The patterns are documented; the tools are new.

---

### Path C: "The Inverse Mirror"
Reveals the gap between perception and reality in AI interaction.

**Pairs:**
1. What you think you're doing / What the system is doing
2. What you think you're seeing / What you're not seeing
3. What you think you chose / What was chosen for you
4. What you think is neutral / What has embedded values
5. What you think is personal / What is systemic

**Thesis:** The most dangerous filtering is invisible.

---

## Results Framework

### Dimensions Measured

**Path A:**
- Creation independence
- Consumption awareness
- Feedback consciousness

**Path B:**
- Historical pattern recognition
- Structural awareness
- Centralization concern

**Path C:**
- Visibility of filtering
- Agency vs. architecture
- Individual vs. systemic thinking

### Result Types

| Type | Description |
|------|-------------|
| The Sleepwalker | Uses AI heavily, trusts implicitly, hasn't considered systemic effects |
| The Skeptic | Distrusts AI, avoids it, may not understand structural dynamics |
| The Participant | Uses thoughtfully, sees patterns, participates anyway |
| The Architect | Works in/on AI, understands mechanics, may feel conflicted |
| The Witness | Sees patterns clearly, struggles with action |
| The Resister | Actively minimizes AI, seeks alternatives, accepts friction |

---

## Shareable Output

Each completed journey generates:
- Unique permalink with encoded answers
- Simple hand-drawn graphic showing position
- One-sentence summary
- OG tags for social sharing

**Example hooks:**
- *"I took the mirror test. I'm a Sleepwalker. Are you?"*
- *"The Amplification Chain showed me where my words go."*
- *"5 pillars of techno-authoritarianism. I scored high on 3."*

---

## Technical Requirements

### Core Features
- Static site (no server-side state)
- Answer state encoded in URL
- OG image generation (or pre-generated combinations)
- Mobile-first responsive design
- Accessible (screen readers, keyboard nav)

### Stack Considerations
- Simple HTML/CSS/JS
- No framework unless necessary
- Minimal dependencies
- Fast loading (no heavy assets)
- Works without JavaScript (progressive enhancement)

---

## Content Development Phases

### Phase 1: Foundation
- [ ] Finalize question sets for all three paths
- [ ] Write educational inserts for each question
- [ ] Define scoring/mapping logic
- [ ] Create result type descriptions

### Phase 2: Design
- [ ] Develop hand-drawn illustration style
- [ ] Create path iconography
- [ ] Design question/answer layouts
- [ ] Design result pages

### Phase 3: Build
- [ ] Implement decision tree logic
- [ ] Build permalink encoding/decoding
- [ ] Generate OG images
- [ ] Test all paths thoroughly

### Phase 4: Launch
- [ ] Domain setup (faiscism.org?)
- [ ] Analytics (privacy-respecting)
- [ ] Social sharing testing
- [ ] Soft launch for feedback

---

## Open Questions

1. **Scope:** Include social media/VR broadly, or focus tightly on AI?
2. **Tone:** How provocative vs. educational?
3. **Length:** Current ~10 questions per path—too many? Too few?
4. **Results:** Single result type, or dimensional profile?
5. **Action:** What do we want people to *do* after taking the quiz?

---

## Success Metrics

- Completion rate (people finishing paths)
- Share rate (people sharing results)
- Multi-path rate (people taking multiple paths)
- Return rate (people coming back)
- Qualitative feedback

---

## Related Documents

- `plan-a-amplification-chain.md` - Detailed Path A specification
- `plan-b-five-pillars.md` - Detailed Path B specification
- `plan-c-inverse-mirror.md` - Detailed Path C specification
