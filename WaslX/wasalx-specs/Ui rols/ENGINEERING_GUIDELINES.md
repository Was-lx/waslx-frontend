## Purpose

This document is the single source of truth for the entire project.

Every future task, feature, bug fix, refactor, component, service, model, page, dialog, API integration, state management implementation, or UI update MUST follow these rules.

Never ignore these guidelines.

If a requested implementation conflicts with these rules, prefer these rules.

---

# General Rules

Always preserve the existing architecture.

Never change folder structure.

Never move files unless explicitly requested.

Never rename files unless required.

Never create duplicate functionality.

Always reuse existing code whenever possible.

---

# Architecture Rules

This project follows:

- Feature-Based Architecture
- Clean Architecture
- SOLID Principles
- Separation of Concerns
- Standalone Components
- Lazy Loading
- Functional Routing
- Functional Guards
- Functional Interceptors
- Signals-first state management

Never introduce a different architecture.

---

# Feature Rules

Every new feature must be created inside

```text
features/
```

Each feature must contain only the following folders:

```text
pages/
components/
dialogs/
services/
models/
interfaces/
store/
```

Do not create additional folders unless explicitly approved.

---

# Component Rules

Every component must belong to one feature.

Never place feature components inside Shared.

Component responsibilities:

- One purpose only.
- Small and reusable.
- No duplicated logic.
- No business logic inside HTML.
- Prefer Signals for local state.
- Keep templates clean.

Component naming:

```text
user-card.component

conversation-item.component

chat-header.component

analytics-chart.component
```

---

# Page Rules

Pages represent routes.

Pages should orchestrate components.

Pages should not contain reusable UI.

Pages should remain lightweight.

---

# Shared Rules

Shared is ONLY for reusable resources.

Examples:

Components

Pipes

Directives

Validators

Utilities

Icons

If something is used by only one feature, it MUST stay inside that feature.

---

# Core Rules

Core contains global services only.

Examples

Authentication

API Client

Interceptors

Guards

Application Configuration

Logger

Global Tokens

Never place feature-specific code inside Core.

---

# Service Rules

One service = one responsibility.

Never create giant services.

Business logic belongs inside services.

UI logic belongs inside components.

HTTP calls belong inside API services.

---

# API Rules

Each feature owns its API service.

Example

```text
users-api.service.ts

teams-api.service.ts

analytics-api.service.ts
```

Never create one massive API service.

---

# State Management

Use Signals by default.

State belongs inside the feature.

Never create global state unless necessary.

Keep state minimal.

---

# Model Rules

Each feature owns its models.

Example

```text
user.model.ts

team.model.ts

chat.model.ts
```

Never share feature models through Core.

---

# Interface Rules

Interfaces remain close to the feature.

Never create a giant interfaces folder.

---

# Styling Rules

Prefer SCSS.

Keep component styles isolated.

No inline styles.

No duplicated CSS.

Use global styles only for design tokens, typography, spacing, colors, and utility classes.

---

# Routing Rules

Every feature owns its own routing file.

Use Lazy Loading.

Never place feature routes inside App Routes directly.

---

# Naming Convention

Components

```text
user-card.component.ts
```

Pages

```text
dashboard.page.ts
```

Services

```text
auth.service.ts
```

API Services

```text
users-api.service.ts
```

Models

```text
user.model.ts
```

Interfaces

```text
user.interface.ts
```

Guards

```text
auth.guard.ts
```

Interceptors

```text
auth.interceptor.ts
```

Routes

```text
users.routes.ts
```

---

# Code Quality

Every implementation must follow:

- SOLID
- DRY
- KISS
- Clean Code
- Readability first
- Maintainability first
- Scalability first

---

# Before Creating Anything

Always check:

- Does this already exist?
- Can it be reused?
- Is it in the correct feature?
- Does it violate the architecture?
- Does it respect naming conventions?
- Is it the smallest possible implementation?

---

# AI Agent Rules

Before implementing any task, always:

1. Read this document.
2. Follow the project architecture.
3. Reuse existing code.
4. Keep the code modular.
5. Do not invent new patterns.
6. Do not change the architecture.
7. Do not create duplicate components.
8. Keep all implementations consistent with the existing project.

These rules override all future implementation decisions unless explicitly instructed otherwise by the project owner.
