# WaslX Design System

## Purpose

This document defines the visual and interaction language for WaslX. Every future screen, component, dialog, table, navigation surface, and data display must conform to these standards so the product feels cohesive, premium, and enterprise-ready.

The system is optimized for a modern SaaS product focused on productivity, clarity, and trust.

Related documents:

- [ARCHITECTURE.md](ARCHITECTURE.md) defines where UI concerns belong in the codebase.
- [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) defines the reusable component contract that must express this design system.

## Brand Identity

Brand name:

- WaslX

Product type:

- AI-powered WhatsApp Team Inbox

Brand personality:

- Modern
- Minimal
- Professional
- Enterprise-ready
- AI-first
- Clean
- Fast
- High trust
- Highly readable

Visual inspiration:

- Linear
- Notion
- Stripe Dashboard
- Vercel Dashboard
- Slack
- Intercom
- Zendesk
- Attio
- Arc Browser

These references are only inspiration. The product must not copy their layouts, spacing, or visual identity directly.

The product should feel visually consistent across dashboards, inbox workflows, admin surfaces, onboarding, and empty states.

## Official Logo Usage

The official logo is part of the product identity and must always be used when branding is required.

Rules:

- Use the existing logo asset only.
- Do not redraw the logo.
- Do not replace the logo with a text mark.
- Do not create alternate brand marks.
- Keep the logo visually prominent but not overpowering.

Recommended asset location:

- `/public/logo.png`

The logo should appear in places such as the app shell, login surface, and any branded empty or onboarding state where identity is needed.

## Color Palette

Use a restrained enterprise palette with a strong primary gradient and clear semantic colors.

### Primary

Deep blue gradient:

- `#1E3A8A`
- `#2563EB`

Use for:

- Primary actions
- Key brand moments
- High-priority navigation emphasis

### Secondary

Cyan:

- `#06B6D4`

Use for:

- Connections
- Status highlights
- Active elements
- AI accent support

### AI Accent

Purple:

- `#8B5CF6`

Use for:

- AI suggestions
- Smart actions
- AI badges
- Insight highlights

Use the blue gradient for primary action surfaces and major brand moments, cyan for connectivity and operational states, and purple for AI assistance and smart insights.

### Text

Primary text:

- `#0F172A`

Secondary text:

- `#475569`

Muted text:

- `#94A3B8`

### Background

Primary background:

- `#FFFFFF`

Secondary background:

- `#F8FAFC`

### Borders

- `#E2E8F0`

### Semantic Colors

Success:

- `#22C55E`

Warning:

- `#F59E0B`

Danger:

- `#EF4444`

Error:

- `#DC2626`

Rules:

- Do not use WhatsApp green as a brand color.
- Do not introduce random accent colors without approval.
- Use semantic color meaning consistently across the product.

Every future component should expose tones and variants that map cleanly to this palette rather than inventing new visual categories.

## Typography

Primary typeface:

- Inter

Fallback:

- system-ui

Typography goals:

- High legibility
- Clear hierarchy
- Tight but breathable spacing
- Consistent rhythm across the app

Recommended hierarchy:

- Display
- H1
- H2
- H3
- Body
- Caption
- Button
- Navigation

Typography rules:

- Use a single family for the entire product unless a future brand decision changes it.
- Avoid decorative or novelty fonts.
- Use weight and size to create hierarchy rather than color alone.
- Keep line length readable on desktop and mobile.

Typography should remain predictable across all screens so the product feels like one system rather than a collection of unrelated views.

## Spacing System

Use an 8px-based spacing scale.

Allowed spacing values:

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48
- 64

Rules:

- Do not introduce arbitrary spacing values.
- Use consistent vertical rhythm throughout forms, cards, modals, and lists.
- Maintain generous whitespace so the interface feels calm and premium.

## Border Radius

Use rounded geometry consistently.

Standard values:

- Cards: 16px
- Buttons: 12px
- Inputs: 12px
- Dialogs: 20px
- Dropdowns: 12px
- Tags: 999px

Rules:

- Use radius to reinforce hierarchy.
- Do not mix sharp and soft corner languages without a clear structural reason.

## Shadows

Use soft shadows only.

Rules:

- Cards should appear slightly elevated.
- Dialogs should appear more elevated than cards.
- Avoid heavy, dark, or distracting shadows.
- Shadows should support depth, not dominate the page.

## Icons

Use Lucide Icons only.

Rules:

- Do not mix icon libraries.
- Use consistent stroke weight and sizing.
- Standard icon sizes are 20px or 24px.
- Use icons to reinforce meaning, not as decoration.

## Layout Rules

Layout must feel open, readable, and stable.

Principles:

- Desktop-first design
- Strong content hierarchy
- Clear separation between navigation, content, and contextual actions
- Responsive behavior that preserves structure rather than collapsing into clutter

Common layout patterns:

- App shell
- Sidebar navigation
- Top navigation utility bar
- Content pages with cards and sections
- Split-pane inbox and detail views

Rules:

- Avoid visual noise.
- Avoid excessive borders.
- Use cards and whitespace to organize meaning.
- Keep the interface consistent across features.

The layout language should remain compatible with the shell, feature pages, data grids, chat views, and AI surfaces defined in the component library.

## Navigation

### Sidebar

The sidebar should be minimal, icon-led, and clearly structured.

Requirements:

- Icons and labels
- Active state indicator
- Hover state
- Collapsed support

### Top Navigation

The top bar should support utility actions without feeling crowded.

Typical elements:

- Search
- Notifications
- Profile access
- Quick actions

Rules:

- Navigation should never compete with primary content.
- Active routes must be obvious.

## Tables

Tables are a major enterprise surface and must be clean and efficient.

Required table behavior:

- Rounded container
- Minimal chrome
- Hover rows
- Sticky header where needed
- Pagination
- Sorting
- Filtering
- Search
- Bulk actions

Rules:

- Keep row density readable.
- Avoid dense spreadsheet styling.
- Use clear empty, loading, and error states.

## Tags and Badges

Use pill-shaped labels for lightweight metadata.

Examples of tag semantics:

- Urgent
- AI
- Billing
- Resolved
- Pending
- Enterprise
- Question
- Internal

Rules:

- Keep tags small and legible.
- Avoid overpowering the surrounding content.
- Use semantic meaning consistently.

## Dashboard Widgets

Dashboards should communicate status without crowding the page.

Widget categories:

- Cards
- Charts
- Metrics
- Activity
- Timeline
- Statistics
- KPIs
- AI Summary

Rules:

- Never overcrowd dashboards.
- Prefer a small number of meaningful widgets over many noisy ones.
- Keep summaries short and actionable.

## AI Components

AI surfaces should feel confident, subtle, and clearly differentiated.

Use the purple accent for AI affordances and insight surfaces.

Examples:

- AI Suggested Reply
- AI Summary
- AI Insights
- AI Routing
- AI Assistant
- AI Labels

Rules:

- AI content must be visually distinct but still fit the system.
- Use badges, cards, and subtle highlights rather than flashy effects.

## Animations

Motion should be subtle and purposeful.

Allowed animation types:

- Fade
- Slide
- Scale

Duration:

- 150ms to 250ms

Rules:

- Motion should support comprehension.
- Avoid flashy or distracting transitions.
- Use motion sparingly for entrance, state change, and confirmation.

## Component Styling Rules

All components must conform to the same visual language.

Requirements:

- Rounded corners
- Soft borders
- Soft shadows
- Clear typography hierarchy
- Responsive spacing
- Accessible focus states
- Consistent loading and empty states

Rules:

- No component should introduce its own private design language.
- Components should be visually coherent even when used in different features.
- Keep styles token-driven and reusable.

These rules apply to every reusable UI surface described in [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md).

## Responsive Design

Design order:

- Desktop
- Tablet
- Mobile

Rules:

- Preserve content hierarchy across breakpoints.
- Do not break layouts to fit smaller screens.
- Reduce density intelligently instead of hiding critical information.

## Accessibility

Accessibility is a design requirement, not an optional enhancement.

Requirements:

- Keyboard navigation
- Visible focus states
- ARIA labels where needed
- Semantic HTML
- Proper contrast
- Screen-reader-friendly structure

Rules:

- Interactive elements must have accessible names.
- Color must not be the only indicator of meaning.
- Error states must be clear and readable.

## Design Principles

Every screen should feel:

- Simple
- Modern
- Professional
- Minimal
- Clean
- Fast
- Premium
- Enterprise-ready

Never:

- Overcrowd layouts
- Mix multiple design languages
- Add unnecessary borders
- Use excessive color
- Use heavy shadows
- Use flashy motion

## Future-Proofing

The design system should support future additions without becoming fragmented.

It must be ready for:

- Dark mode
- Localization
- Additional enterprise dashboards
- More AI surfaces
- New workflow states
- Expanded responsive behaviors

The core visual language should remain stable even as product scope grows.

Any future addition to the component library must conform to this document before implementation begins.
