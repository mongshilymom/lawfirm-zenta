# Dark Academia UX & UI Playbook

## Brand System
- **Palette**: Deep slate (#1E1F26), antique gold (#C5A572), parchment ivory (#F5E6D3), burgundy accents (#5B1A18).
- **Typography**: Primary serif (Canela/Playfair); secondary sans (Aktiv Grotesk) for readability.
- **Textures**: Subtle paper grain overlays with 5% opacity; maintain WCAG AA contrast.

## Navigation & 3-Click Compliance
1. **Global Nav (Sticky)**
   - Links: Find a Lawyer, Consultation, Practice Areas, Insights, About, AI Chat.
   - Right-aligned CTA "AI챗 상담 신청" persistent.
2. **Contextual Breadcrumbs** on deeper pages to maintain orientation.
3. **Jump Links & Sticky Filters**: Attorney directory retains filter panel on scroll.
4. **Accessibility**: Keyboard focus outlines, ARIA landmarks, skip-to-content anchor.

## Hero Section Specification
- **Layout**: Full viewport height with central headline (H1 72px) and supporting subcopy.
- **Parallax Mechanics**: Mousemove-based transform on foreground typography and background imagery; ensure `prefers-reduced-motion` fallback to static.
- **CTA Placement**: Primary CTA centered below headline; secondary nav CTA pinned top-right.
- **Imagery**: Dark academia library silhouette with gradient overlay.

## Team Experience (500 Lawyers)
- **Presentation**: Magazine-style list with alternating imagery/text to reduce repetition.
- **Filters**:  - Specialty (multi-select, tag pills).
  - Role (Partner, Associate, Counsel).
  - Experience (slider default ≥10 years).
- **Performance**: Use virtualized list, server-driven pagination, and search debouncing (200ms).
- **Profile Highlights**: Snapshot showing languages, key cases, AI-generated insights summary.

## Smart FAQ & AI Chat UI
- Unified command bar triggered by `Ctrl+K` to query FAQs.
- Responses show top 3 FAQs with link + assigned attorney card.
- Chat transcript includes risk badge (Low/Medium/High) and document checklist chips.

## QA Checklist
- Tab order validated in Browserbase script.
- CLS measured with synthetic navigation flows; hero parallax freeze on load to prevent layout shift.
- Color contrast validated with automated tooling for AA compliance.