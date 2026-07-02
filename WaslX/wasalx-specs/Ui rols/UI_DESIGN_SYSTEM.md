# UI_DESIGN_SYSTEM.md

# WaslX Design System

## Purpose

This document is the single source of truth for every UI implementation in this project.

Every future page, component, dialog, card, modal, layout, dashboard, table, form, button, navigation item, and widget MUST follow this design system.

Never invent a different style.

Never mix multiple design languages.

Everything must look like it belongs to the same SaaS product.

---

# Brand Identity

Product Name

WaslX

Product Type

AI-powered WhatsApp Team Inbox

Design Style

Modern SaaS

Minimal

Professional

Enterprise

AI-first

Clean

Highly readable

Large white spaces

Rounded corners

Soft shadows

Premium feeling

Inspired by

- Linear
- Notion
- Stripe Dashboard
- Vercel Dashboard
- Slack
- Intercom
- Zendesk
- Attio
- Arc Browser

Never copy them.

Only use them as inspiration.

---

# Official Logo

The project already contains the official logo.

The logo image is located inside the project as:

```text
/public/logo.png
```

or

```text
/assets/logo.png
```

(Use the existing logo wherever it exists in the project.)

Never redesign the logo.

Never recreate it.

Never replace it.

Always use the official logo.

The logo defines the visual identity of the product.

---

# Design Philosophy

Every screen should feel

Simple

Modern

Professional

Minimal

Clean

Fast

Premium

AI-first

Enterprise Ready

Every UI should have breathing room.

Avoid clutter.

Avoid unnecessary borders.

Avoid visual noise.

---

# Color Palette

Primary

Deep Blue Gradient

Example

From

#1E3A8A

To

#2563EB

Secondary

Cyan

#06B6D4

Used for

Connections

Highlights

Status

Active Elements

AI Accent

Purple

#8B5CF6

Used for

AI Features

AI Suggestions

Smart Actions

AI Badges

Background Highlights

Text

Primary

#0F172A

Secondary

#475569

Muted

#94A3B8

Background

#FFFFFF

Secondary Background

#F8FAFC

Borders

#E2E8F0

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Error

#DC2626

Never use WhatsApp Green.

---

# Border Radius

Cards

16px

Buttons

12px

Inputs

12px

Dialogs

20px

Dropdowns

12px

Tags

999px

---

# Shadows

Soft shadows only.

Never use heavy shadows.

Cards should appear slightly elevated.

Dialogs slightly more elevated.

---

# Typography

Use

Inter

Fallback

system-ui

Hierarchy

Display

H1

H2

H3

Body

Caption

Buttons

Navigation

Everything should have consistent spacing.

---

# Spacing

Use an 8px spacing system.

Allowed values

4

8

12

16

20

24

32

40

48

64

Never use random spacing values.

---

# Icons

Use only Lucide Icons.

Never mix icon libraries.

Icons should use

20px

or

24px

Only.

---

# Buttons

Every button should have

Primary

Secondary

Ghost

Danger

Outline

Icon Button

Loading State

Disabled State

Hover State

Focus State

---

# Inputs

Every input should support

Label

Placeholder

Validation

Helper Text

Error State

Disabled

Prefix

Suffix

Icon

Loading

---

# Cards

Cards are the primary layout element.

Every card should have

Rounded corners

Soft border

Soft shadow

Proper padding

Clear typography hierarchy

Optional badge

Optional actions

Optional footer

---

# Navigation

Sidebar

Minimal

Icons

Labels

Active Indicator

Hover State

Collapsed Support

Top Navigation

Search

Notifications

Profile

Quick Actions

---

# Tables

Rounded

Minimal

Hover rows

Sticky header

Pagination

Sorting

Filtering

Search

Bulk actions

---

# Tags

Rounded pills

Minimal

Small

Examples

Urgent

AI

Billing

Resolved

Pending

Enterprise

Question

Internal

---

# Dashboard Widgets

Cards

Charts

Metrics

Activity

Timeline

Statistics

KPIs

AI Summary

Never overcrowd dashboards.

---

# AI Components

AI Suggested Reply

AI Summary

AI Insights

AI Routing

AI Assistant

AI Labels

Always use Purple Accent.

---

# Animations

Very subtle.

Use only

Fade

Slide

Scale

Duration

150ms–250ms

Never use flashy animations.

---

# Component Rules

Every component must

Have one responsibility.

Be reusable.

Be responsive.

Be accessible.

Support Dark Mode in the future.

Support loading state.

Support empty state.

Support error state.

---

# Responsive Design

Desktop First

Then

Tablet

Then

Mobile

Never break layouts.

---

# Accessibility

Keyboard navigation

ARIA labels

Visible focus

Proper contrast

Semantic HTML

---

# File Structure

Every reusable UI component belongs inside

```text
shared/ui/
```

Examples

Button

Input

Modal

Dialog

Avatar

Badge

Card

Dropdown

Tabs

Table

Tooltip

Pagination

Empty State

Loading Spinner

Skeleton

Toast

---

# UI Component Library

Before implementing any page, ensure the project already contains reusable components for:

- Button
- Icon Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Avatar
- Badge
- Chip
- Card
- Modal
- Dialog
- Drawer
- Tooltip
- Dropdown
- Tabs
- Table
- Pagination
- Breadcrumb
- Sidebar
- Navbar
- Search Input
- Notification Badge
- Empty State
- Loading Spinner
- Skeleton Loader
- Toast
- AI Card
- AI Suggestion Card
- Message Bubble
- Conversation Card
- Timeline Item
- Status Indicator

These components should be generic, reusable, and configurable through Inputs instead of being hardcoded.

---

# AI Agent Rules

Before creating any new page or component:

- Reuse existing UI components.
- Never duplicate components.
- Never create inconsistent styles.
- Follow this Design System exactly.
- Keep everything visually identical across the project.
- If a required component already exists, extend it instead of creating a new one.
- Every new feature must feel like it was designed on the same day by the same design team.

This document overrides any future design decisions unless explicitly changed by the project owner.
