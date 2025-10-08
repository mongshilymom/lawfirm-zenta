# AI & Automation Implementation Guide

## GPT-5 Consultation Agent
- **Knowledge Sources**: Supabase `attorneys`, `case_studies`, `insights_updates`, Firecrawl regulatory feeds.
- **Conversation Flow**:
  1. Intake question → detect intent (FAQ vs. bespoke consultation).
  2. Retrieve context via hybrid search (semantic + keyword) from Supabase.
  3. Classify risk level using rule-based + ML ensemble (thresholds tuned with SME feedback).
  4. Generate response with structured JSON: `{ riskLevel, summary, requiredDocuments[], recommendedAttorney }`.
  5. Render response in chat UI with badges and checklist chips.
- **Compliance Controls**: Logging to Supabase `ai_audit_log`, redaction of PII via OpenAI moderation filters.

## Smart FAQ Engine
- **Command Palette UI**: Hook into Next.js server actions to fetch top 3 FAQ entries.
- **Matching Strategy**: `pgvector` embeddings + tf-idf fallback; boost recency for `insights_updates`.
- **Attorney Matching**: `attorney_specialties` join table ranks lawyers with relevant experience; fallback to GPT suggestion if no direct match.

## Automation Pipelines
### HubSpot Integration
- Use Supabase Edge Function to call HubSpot CRM API.
- Payload includes risk assessment, document checklist, conversation transcript link.

### Linear Tasking
- Same trigger posts to Linear API with SLA metadata (`response_due_at` within 2h), attaches Supabase record URL.