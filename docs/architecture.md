# ZENTA Law Firm Architecture Blueprint

## Vision Alignment
- **Trust-Centered Dark Academia Experience**: Establish a design system anchored in deep slate palettes, serif typography, and tactile textures to project authority and transparency.
- **3-Click Rule Guarantee**: Navigation and IA will be prototyped and validated so that critical actions (Find a Lawyer, Request Consultation, Explore Practices) are reachable in <=3 interactions.
- **Hyper-Scalable People Directory**: Target sub-second (≤1s) search latency for 500+ attorney profiles via indexed storage, edge caching, and client-side hydration strategies.

## High-Level System Topology
```
[Firecrawl MCP] ---> [Supabase (Postgres + Edge Functions)] <--- [Next.js 14 App Router]
      |                                                        |
      |                                                        +--> [Magic UI Component Server]
      |                                                        |
      +--> [Insights Updater Worker]                           +--> [AI Service Layer (GPT-5)]

[Browserbase QA] ---> [Cloudflare Workers Edge Layer] <--- [HubSpot + Linear Automations]
```

## Core Components
### Next.js Frontend
- **Rendering Strategy**: Mix of SSR for hero/landing, ISR for news and insights, CSR for high-frequency search interactions.
- **State/Cache**: React Server Components for static data, Suspense + streaming for attorney search results.
- **Styling**: Tailwind CSS with custom Dark Academia tokens; fallback to CSS variables for theming.
### Supabase Stack
- **Postgres Schemas**
  - `attorneys`: 500+ records with full-text search, JSONB metadata for specialties, positions, tenure.
  - `case_studies`, `news_articles`, `insights_updates`: versioned content with audit logs.
  - `faq_entries`: curated knowledge base for Smart FAQ.
- **Edge Functions**
  - `hubspot-sync`: Webhook triggered on consultation form submit; pushes to HubSpot Contacts + deals.
  - `linear-ticket`: Creates "New Consultation Lead" issue with metadata payload.
  - `firecrawl-ingest`: Receives crawled legal updates and publishes to `insights_updates`.
- **Search Indexing**
  - Use Supabase pgvector or Elastic integration for semantic matching.
  - Maintain materialized view `attorney_search_index` with trigram + vector indexes.

### Firecrawl MCP Integration
- **Competitive Intelligence Pipeline**
  - Scheduled crawls of peer law firms (Eje Law, etc.) stored in `design_research` bucket for analysis.
- **Regulatory Watcher**
  - RSS + HTML diffing to flag law/regulation changes; automates updates to Supabase `insights_updates`.

### HubSpot & Linear Automations
- Consultation submissions trigger parallel workflows:
  - HubSpot: Create/update contact, attach conversation transcript, set lifecycle stage.
  - Linear: Create ticket tagged `lead`, assign to business development board with SLA metadata.
- Maintain failover queue via Supabase table `automation_failures` monitored by cron job.
### Cloudflare Edge & Browserbase QA
- **Cloudflare Workers** handle:
  - Edge caching of SSR pages with revalidation hooks.
  - WAF policies tuned for legal industry threats.
- **Browserbase Automation**
  - Playwright scripts per commit testing:
    - 3-Click journeys.
    - CLS metrics (<0.1) even with parallax hero.
    - WCAG AA contrast compliance for Dark Academia palette.

## Data Flows
1. Visitor triggers AI chat → GPT-5 agent queries Supabase knowledge base → returns risk level + document checklist → logs lead via Edge Function.
2. Firecrawl job detects regulation update → posts to Supabase → triggers revalidation of Insights ISR route.
3. Team member commits new UI → Browserbase CI runs, reporting metrics back to GitHub via MCP connector.

## Implementation Milestones
1. **Scaffold**: Initialize Next.js app, Tailwind, Supabase client, base routes.
2. **Data Layer**: Define SQL migrations, seed 500 attorney records (synthetic for QA).
3. **Hero & Navigation**: Implement parallax hero component and global nav satisfying 3-click rule.
4. **Search Experience**: Build attorney explorer with sticky filters and 1s search target.
5. **AI Integrations**: Connect GPT-5 agent endpoints; implement risk grading + checklist logic.
6. **Automation & QA**: Wire HubSpot/Linear; configure Browserbase + Cloudflare pipeline.
7. **Deployment**: Use GitHub Spark to deploy to Cloudflare Pages/Vercel with domain binding.

## Risk & Mitigation
- **Performance Regression**: Use Lighthouse CI + Browserbase metrics gate.
- **Data Freshness**: Schedule Firecrawl updates hourly; fallback manual triggers.
- **Compliance**: Review AI outputs with legal experts; maintain audit logs in Supabase.

## Next Steps
- Stand up Supabase project with defined schemas.
- Generate Magic UI components for hero and team layouts.
- Author CI pipelines for MCP connectors (GitHub Actions integration).