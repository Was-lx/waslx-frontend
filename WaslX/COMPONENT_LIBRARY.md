# WaslX Component Library

## Purpose

This document specifies the reusable component library that will eventually power WaslX. It defines what components must exist, what each component is responsible for, and how each component must behave when implemented later.

This is a specification only. No component implementation is included in this phase.

Related documents:

- [ARCHITECTURE.md](ARCHITECTURE.md) defines where these components belong in the project structure.
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) defines how these components must look and behave visually.

## Library Principles

Every reusable component in WaslX must follow these rules:

- One component, one responsibility
- Reusable across features where appropriate
- Configurable through inputs rather than hardcoded behavior
- Accessible by default
- Responsive by default
- Support loading, empty, and error states where relevant
- Align with the official design system
- Avoid feature-specific assumptions

The library must be generic enough to support all current and future WaslX features without creating duplicate components for each screen.

## Component Inventory

The project component library must eventually include the following reusable building blocks:

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

Additional utility components may be added later only if they are generic, reusable, and aligned with the design system.

Each component category should map to a reusable design primitive, not a single feature workflow.

## Spec Format

Each component specification below defines:

- Purpose
- Responsibilities
- Variants
- States
- Props / Inputs
- Outputs
- Accessibility requirements
- Usage guidelines
- Design rules

If a component does not need every common input or output, it should not expose empty or misleading props. The API should stay minimal and honest.

## Button

Purpose:

- Primary action surface used across the application.

Responsibilities:

- Trigger user actions
- Support hierarchy between primary and secondary actions
- Provide consistent loading and disabled behavior

Variants:

- Primary
- Secondary
- Ghost
- Danger
- Outline
- Icon

States:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading

Props / Inputs:

- Label
- Variant
- Size
- Disabled
- Loading
- Type
- Full width
- Icon alignment

Outputs:

- Click

Accessibility requirements:

- Keyboard focusable
- Proper button semantics
- Accessible name from label or aria-label
- Loading state announced clearly when needed

Usage guidelines:

- Use for clear actions only.
- Prefer one primary action per surface.
- Do not overload buttons with unrelated responsibilities.

Design rules:

- 12px radius
- Clear contrast
- Strong hover and focus feedback

## Icon Button

Purpose:

- Compact control for icon-only actions.

Responsibilities:

- Trigger secondary or contextual actions
- Preserve compact layouts

Variants:

- Default
- Ghost
- Outline
- Danger

States:

- Default
- Hover
- Focus
- Disabled
- Loading

Props / Inputs:

- Icon
- Aria label
- Variant
- Size
- Disabled
- Loading

Outputs:

- Click

Accessibility requirements:

- Must always have an accessible label
- Must support keyboard interaction

Usage guidelines:

- Use only when text labels would be redundant or space-constrained.

Design rules:

- Compact, rounded, and visually consistent with standard buttons

## Input

Purpose:

- Single-line text entry field.

Responsibilities:

- Capture text input
- Support validation states and helper text
- Display optional prefix and suffix content

Variants:

- Default
- Search
- Password
- Email
- Number

States:

- Default
- Focus
- Filled
- Disabled
- Error
- Loading

Props / Inputs:

- Label
- Placeholder
- Value
- Type
- Disabled
- Readonly
- Required
- Helper text
- Error text
- Prefix
- Suffix
- Icon

Outputs:

- Value change
- Focus
- Blur
- Enter key action where appropriate

Accessibility requirements:

- Label association required
- Error text must be announced when present
- Keyboard-friendly and screen-reader-friendly

Usage guidelines:

- Use for single-line input only.
- Keep helper text concise and actionable.

Design rules:

- 12px radius
- Clear label hierarchy
- Strong focus ring

## Textarea

Purpose:

- Multi-line text entry field.

Responsibilities:

- Capture long-form text
- Support auto-resize when appropriate
- Show validation and helper text

Variants:

- Default
- Auto resize

States:

- Default
- Focus
- Filled
- Disabled
- Error

Props / Inputs:

- Label
- Placeholder
- Value
- Rows
- Disabled
- Readonly
- Required
- Helper text
- Error text

Outputs:

- Value change
- Focus
- Blur

Accessibility requirements:

- Label association required
- Clear error messaging

Usage guidelines:

- Use for longer comments, notes, and message content.

Design rules:

- Same field language as Input

## Select

Purpose:

- Controlled selection from predefined options.

Responsibilities:

- Present options clearly
- Support single selection and future extensibility where needed

Variants:

- Default
- Searchable
- Multi-select when approved

States:

- Default
- Open
- Selected
- Disabled
- Error

Props / Inputs:

- Label
- Options
- Value
- Placeholder
- Disabled
- Searchable
- Helper text
- Error text

Outputs:

- Selection change
- Open
- Close

Accessibility requirements:

- Keyboard navigable
- Option selection announced properly

Usage guidelines:

- Use for bounded choices, not free text.

Design rules:

- Match input styling and spacing

## Checkbox

Purpose:

- Boolean selection control.

Responsibilities:

- Toggle binary state
- Support group-based selection patterns when necessary

Variants:

- Default
- Indeterminate

States:

- Checked
- Unchecked
- Indeterminate
- Disabled
- Focus

Props / Inputs:

- Label
- Checked
- Indeterminate
- Disabled
- Required

Outputs:

- Change

Accessibility requirements:

- Label association required
- Keyboard accessible

Usage guidelines:

- Use for independent yes/no choices.

Design rules:

- Clear checkmark visibility and focus state

## Radio

Purpose:

- Exclusive selection within a group.

Responsibilities:

- Allow one choice from a set

Variants:

- Default

States:

- Selected
- Unselected
- Disabled
- Focus

Props / Inputs:

- Label
- Value
- Selected value
- Disabled

Outputs:

- Change

Accessibility requirements:

- Group semantics required
- Label association required

Usage guidelines:

- Use when users must choose exactly one option.

Design rules:

- Match checkbox rhythm but maintain distinct control shape

## Switch

Purpose:

- Immediate on/off setting.

Responsibilities:

- Toggle setting state
- Convey binary configuration clearly

Variants:

- Default

States:

- On
- Off
- Disabled
- Focus

Props / Inputs:

- Checked
- Disabled
- Label

Outputs:

- Change

Accessibility requirements:

- Must communicate state programmatically
- Keyboard accessible

Usage guidelines:

- Use for settings that take effect immediately.

Design rules:

- Smooth but subtle motion

## Avatar

Purpose:

- Display a person, team, or entity identity marker.

Responsibilities:

- Show image, initials, or fallback representation
- Support compact identity surfaces

Variants:

- Image
- Initials
- Fallback icon

States:

- Default
- Loading
- Missing image

Props / Inputs:

- Name
- Image source
- Size
- Shape
- Fallback text

Outputs:

- Click when used as an interactive trigger

Accessibility requirements:

- Descriptive alt text or aria-label when interactive

Usage guidelines:

- Use consistently in lists, profile surfaces, and conversation metadata.

Design rules:

- Rounded and visually balanced

## Badge

Purpose:

- Compact label for status, category, or metadata.

Responsibilities:

- Convey small pieces of information quickly

Variants:

- Neutral
- Success
- Warning
- Danger
- AI
- Outline

States:

- Default
- Subtle

Props / Inputs:

- Label
- Variant
- Size

Outputs:

- Click when interactive

Accessibility requirements:

- Label must be readable and not rely on color alone

Usage guidelines:

- Keep text short.

Design rules:

- Pill shape and high legibility

## Chip

Purpose:

- Compact removable or selectable token.

Responsibilities:

- Represent filters, tags, or selected entities

Variants:

- Default
- Removable
- Selected

States:

- Default
- Active
- Disabled

Props / Inputs:

- Label
- Removable
- Selected
- Disabled

Outputs:

- Remove
- Click

Accessibility requirements:

- Removal action must be keyboard accessible and labeled

Usage guidelines:

- Use for filter chips and small metadata tokens.

Design rules:

- Rounded, compact, and low-noise

## Card

Purpose:

- Primary layout container for grouped information.

Responsibilities:

- Organize content into clear sections
- Provide structured surfaces for metrics, forms, lists, and summaries

Variants:

- Default
- Interactive
- Elevated
- Flat

States:

- Default
- Hover
- Focus
- Disabled when applicable

Props / Inputs:

- Header
- Body
- Footer
- Badge
- Actions
- Clickable

Outputs:

- Click when interactive

Accessibility requirements:

- Interactive cards need proper focus handling and semantics

Usage guidelines:

- Use cards as the main content container whenever structure is needed.

Design rules:

- 16px radius
- Soft border
- Soft shadow

## Modal

Purpose:

- Temporarily block interaction to capture focused decisions or workflows.

Responsibilities:

- Present overlayed content
- Support closing behavior
- Keep user focus contained

Variants:

- Default
- Confirmation
- Form

States:

- Open
- Closing
- Loading

Props / Inputs:

- Title
- Content
- Size
- Closeable
- Escape behavior
- Backdrop behavior

Outputs:

- Close
- Confirm
- Cancel

Accessibility requirements:

- Focus trap required
- Proper dialog semantics
- Escape and overlay behavior must be controlled and accessible

Usage guidelines:

- Use for shorter tasks and explicit confirmations.

Design rules:

- Elevated, calm, and clearly separated from the page

## Dialog

Purpose:

- Focused decision surface for confirmations, small forms, and alerts.

Responsibilities:

- Present high-priority decisions without leaving context

Variants:

- Confirmation
- Destructive confirmation
- Informational

States:

- Open
- Loading

Props / Inputs:

- Title
- Message
- Primary action
- Secondary action

Outputs:

- Confirm
- Cancel

Accessibility requirements:

- Clear label and focus management required

Usage guidelines:

- Use for decisions that require a deliberate response.

Design rules:

- 20px radius and modal-like presentation language

## Drawer

Purpose:

- Side panel for contextual workflows and details.

Responsibilities:

- Display secondary content without navigating away
- Support dense contextual interactions

Variants:

- Right drawer
- Left drawer when justified

States:

- Open
- Closed
- Loading

Props / Inputs:

- Title
- Size
- Closeable

Outputs:

- Close

Accessibility requirements:

- Focus management required

Usage guidelines:

- Use for details and secondary workflow panes.

Design rules:

- Must feel lighter than a modal but still deliberate

## Tooltip

Purpose:

- Provide short contextual explanation on hover or focus.

Responsibilities:

- Clarify icons, abbreviations, or compact controls

Variants:

- Default

States:

- Visible
- Hidden

Props / Inputs:

- Message
- Placement
- Delay

Accessibility requirements:

- Must appear on focus as well as hover when relevant

Usage guidelines:

- Keep content short and supplemental.

Design rules:

- Light, minimal, and readable

## Dropdown

Purpose:

- Compact menu surface for related actions or choices.

Responsibilities:

- Offer short action lists
- Anchor to a trigger element

Variants:

- Action menu
- Option menu

States:

- Open
- Closed

Props / Inputs:

- Items
- Placement
- Trigger label

Outputs:

- Select item
- Open
- Close

Accessibility requirements:

- Keyboard navigation required

Usage guidelines:

- Use for related secondary actions only.

Design rules:

- Consistent with menus and command surfaces

## Tabs

Purpose:

- Switch between related views within the same context.

Responsibilities:

- Separate peer views without leaving the page

Variants:

- Default
- Compact

States:

- Active
- Inactive
- Disabled

Props / Inputs:

- Tabs list
- Active tab
- Orientation

Outputs:

- Change

Accessibility requirements:

- Proper tab and tabpanel semantics

Usage guidelines:

- Use for directly related content areas.

Design rules:

- Clear active indicator and readable labels

## Table

Purpose:

- Structured data presentation for enterprise workflows.

Responsibilities:

- Display rows and columns clearly
- Support sorting, filtering, selection, and pagination patterns

Variants:

- Default
- Compact
- Dense when approved

States:

- Loading
- Empty
- Error
- Row hover
- Row selected

Props / Inputs:

- Columns
- Data
- Sort state
- Filter state
- Selection state
- Pagination config

Outputs:

- Row click
- Sort change
- Selection change
- Page change

Accessibility requirements:

- Proper table semantics
- Clear headers and associations

Usage guidelines:

- Use for real data operations, not decorative lists.

Design rules:

- Rounded container with minimal chrome

## Pagination

Purpose:

- Navigate through large datasets.

Responsibilities:

- Show page controls clearly

Variants:

- Default

States:

- Active page
- Disabled control

Props / Inputs:

- Current page
- Total pages
- Page size
- Total items

Outputs:

- Page change

Accessibility requirements:

- Keyboard accessible controls and clear labels

Usage guidelines:

- Pair with tables and list views.

Design rules:

- Compact and low-noise

## Breadcrumb

Purpose:

- Display navigation hierarchy and context.

Responsibilities:

- Help users understand their location in nested views

Variants:

- Default

States:

- Active item
- Link item

Props / Inputs:

- Items

Outputs:

- Navigation click

Accessibility requirements:

- Proper list semantics and accessible labels

Usage guidelines:

- Use sparingly where hierarchy adds meaning.

Design rules:

- Minimal and calm

## Sidebar

Purpose:

- Primary application navigation shell.

Responsibilities:

- Display main sections
- Highlight active location
- Support collapsed and expanded states

Variants:

- Expanded
- Collapsed

States:

- Active item
- Hover item
- Disabled item

Props / Inputs:

- Navigation items
- Active route
- Collapsed state

Outputs:

- Navigation click

Accessibility requirements:

- Keyboard navigable
- Clear active state and labels

Usage guidelines:

- Keep primary navigation stable across the app.

Design rules:

- Minimal, icon-led, and structurally calm

## Navbar

Purpose:

- Top application utility and context bar.

Responsibilities:

- Present search, notifications, profile, and quick actions

Variants:

- Default

States:

- Compacted
- Expanded where needed

Props / Inputs:

- Search slot
- Actions slot
- Profile slot

Outputs:

- Action clicks

Accessibility requirements:

- Proper landmark and control labels

Usage guidelines:

- Avoid clutter and overcrowding.

Design rules:

- Lightweight and aligned with shell structure

## Search Input

Purpose:

- Dedicated search entry optimized for discovery and filtering.

Responsibilities:

- Capture search terms
- Support clear behavior and contextual hints

Variants:

- Default
- Compact
- Global

States:

- Empty
- Filled
- Focused
- Disabled

Props / Inputs:

- Placeholder
- Value
- Clearable
- Icon

Outputs:

- Change
- Clear
- Submit

Accessibility requirements:

- Search semantics and accessible labeling required

Usage guidelines:

- Use for inbox, tables, and global navigation search.

Design rules:

- Match input system and stay visually restrained

## Notification Badge

Purpose:

- Display count or status indicator in compact form.

Responsibilities:

- Show unread counts or alerts

Variants:

- Count badge
- Dot badge

States:

- Default
- Empty

Props / Inputs:

- Count
- Max count
- Variant

Accessibility requirements:

- Must not rely only on color for meaning

Usage guidelines:

- Use in navigation and utility surfaces.

Design rules:

- Small, legible, and non-distracting

## Empty State

Purpose:

- Explain the absence of content and guide the next step.

Responsibilities:

- Clarify why content is empty
- Offer a primary next action when appropriate

Variants:

- Default
- Onboarding
- No results
- No permission

States:

- Empty

Props / Inputs:

- Title
- Description
- Icon or illustration
- Action label
- Action handler

Outputs:

- Action click

Accessibility requirements:

- Content must be understandable without the illustration

Usage guidelines:

- Use whenever a screen has no meaningful content to display.

Design rules:

- Calm, generous spacing, and concise guidance

## Loading Spinner

Purpose:

- Communicate in-progress activity.

Responsibilities:

- Indicate loading without distraction

Variants:

- Inline
- Centered
- Small
- Medium
- Large

States:

- Active

Props / Inputs:

- Size
- Label

Accessibility requirements:

- Provide accessible loading text when needed

Usage guidelines:

- Use for short loading transitions and pending states.

Design rules:

- Subtle motion only

## Skeleton Loader

Purpose:

- Provide visual placeholder while content loads.

Responsibilities:

- Reduce layout shift
- Set expectation for incoming content

Variants:

- Text line
- Card block
- Avatar
- Table row

States:

- Active

Props / Inputs:

- Shape
- Size
- Count

Accessibility requirements:

- Should not create confusing noise for assistive technology

Usage guidelines:

- Use for content-rich screens with predictable layout.

Design rules:

- Soft, neutral, and low contrast

## Toast

Purpose:

- Show transient feedback for operations and events.

Responsibilities:

- Communicate success, warning, error, or info messages
- Disappear without blocking the user

Variants:

- Success
- Error
- Warning
- Info

States:

- Visible
- Dismissing

Props / Inputs:

- Title
- Message
- Variant
- Duration
- Action label

Outputs:

- Dismiss
- Action click

Accessibility requirements:

- Announced appropriately
- Do not trap focus

Usage guidelines:

- Use for post-action feedback only.

Design rules:

- Compact, readable, and consistent with semantic colors

## AI Card

Purpose:

- Highlight AI-generated analysis, guidance, or summaries.

Responsibilities:

- Present AI insights clearly
- Support confident but restrained presentation

Variants:

- Summary
- Insight
- Recommendation
- Routing hint

States:

- Default
- Loading
- Empty
- Error

Props / Inputs:

- Title
- Body
- Accent
- Badge
- Actions

Outputs:

- Action click

Accessibility requirements:

- Content must remain readable without color emphasis

Usage guidelines:

- Use when the product wants to surface AI-generated value.

Design rules:

- Purple accent with calm card treatment

## AI Suggestion Card

Purpose:

- Present a recommended AI action or reply.

Responsibilities:

- Display suggestion context
- Provide explicit accept or dismiss behavior

Variants:

- Suggested reply
- Suggested routing
- Suggested action

States:

- Default
- Loading
- Dismissed

Props / Inputs:

- Suggestion text
- Context label
- Accept action
- Dismiss action

Outputs:

- Accept
- Dismiss

Accessibility requirements:

- Action labels must be clear and specific

Usage guidelines:

- Use for high-confidence recommendations only.

Design rules:

- Distinct accent, but visually integrated with the system

## Message Bubble

Purpose:

- Render conversation messages in inbox and chat views.

Responsibilities:

- Display message content with sender context
- Support incoming and outgoing presentation

Variants:

- Incoming
- Outgoing
- System

States:

- Default
- Selected
- Edited
- Failed

Props / Inputs:

- Message body
- Timestamp
- Sender context
- Status
- Attachments summary

Outputs:

- Click
- Retry when failed

Accessibility requirements:

- Message content must be readable and logical in assistive technology order

Usage guidelines:

- Use only within messaging contexts.

Design rules:

- Clear alignment and spacing differences between sender types

## Conversation Card

Purpose:

- Represent a conversation in inbox lists and navigation panes.

Responsibilities:

- Summarize conversation state, participant, and latest activity

Variants:

- Default
- Unread
- Active
- Muted

States:

- Default
- Hover
- Selected
- Empty preview

Props / Inputs:

- Title
- Preview text
- Avatar
- Status
- Timestamp
- Unread count

Outputs:

- Click

Accessibility requirements:

- Must be keyboard navigable and clearly labeled

Usage guidelines:

- Use in conversation lists and selectors.

Design rules:

- Compact but information-rich

## Timeline Item

Purpose:

- Show chronological activity or event history.

Responsibilities:

- Display event name, time, and context
- Support grouped activity streams

Variants:

- Default
- Compact
- Highlighted

States:

- Default
- Active when needed

Props / Inputs:

- Title
- Description
- Timestamp
- Icon
- Status

Accessibility requirements:

- Order must be logical and readable sequentially

Usage guidelines:

- Use for audit trails, event histories, and process timelines.

Design rules:

- Balanced spacing and clear hierarchy

## Status Indicator

Purpose:

- Show an entity state such as online, offline, active, pending, or failed.

Responsibilities:

- Communicate status clearly at a glance

Variants:

- Dot
- Label
- Combined

States:

- Active
- Inactive
- Pending
- Success
- Warning
- Error

Props / Inputs:

- Status
- Label
- Size

Accessibility requirements:

- Do not rely on color alone

Usage guidelines:

- Use for presence, sync state, workflow state, and connection state.

Design rules:

- Minimal but explicit

## Usage Rules

When building future screens, follow these rules:

- Prefer existing reusable components over creating new one-off UI.
- Extend an existing component before introducing a new one with overlapping responsibility.
- Keep props consistent across similar components.
- Avoid feature-specific styling inside shared components.
- Keep accessibility and responsive behavior part of the component contract.
- Support loading, empty, and error states where relevant.

Shared UI components should live under the shared UI surface described in [ARCHITECTURE.md](ARCHITECTURE.md) and should visually conform to [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## Composition Rules

Components should compose predictably:

- Pages compose cards, tables, dialogs, and shells.
- Feature-specific components should live in their owning feature.
- Shared UI should remain generic and safe to reuse.
- Interactive states should be handled consistently across the library.

## Future Extension Rules

Any future component added to this library must meet all of the following criteria:

- It solves a repeated problem.
- It aligns with the design system.
- It is accessible.
- It is configurable through inputs.
- It is reusable across multiple screens or features.
- It does not duplicate an existing component’s responsibility.

This library is the implementation target for the design system. No component should drift from the documented palette, spacing, radius, shadow, or accessibility rules.
