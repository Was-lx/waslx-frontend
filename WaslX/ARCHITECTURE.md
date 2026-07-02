# WaslX Architecture

## Purpose

This document defines the application architecture for WaslX and acts as the reference for all future implementation work. It is intentionally framework-specific, production-oriented, and optimized for a large enterprise SaaS product built with Angular.

The application is an AI-powered WhatsApp team inbox, so the architecture must support authenticated workspace access, feature isolation, lazy loading, reusable infrastructure, and long-term scalability without coupling the UI to business rules.

Related documents:

- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) defines the visual language and interaction standards.
- [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) defines the reusable UI contract that future implementation must follow.

## Architectural Principles

The project follows the following principles at all times:

- Feature-Based Architecture
- Standalone Angular Components only
- Functional routing, guards, and interceptors
- Lazy loading for every feature entry point
- Signals-first state management
- Clean Architecture boundaries
- SOLID design principles
- Reusable shared utilities only when truly cross-cutting
- One responsibility per file, service, component, and module boundary
- Minimal coupling between features
- High cohesion within each feature

These principles are not optional. If a future implementation conflicts with this document, this document wins unless the project owner explicitly changes the standard.

## High-Level Layering

The application is organized into four primary layers:

### App Layer

The app layer is the composition root. It wires global providers, bootstraps routing, and connects application-wide configuration.

Responsibilities:

- Bootstrap the Angular application
- Provide global application configuration
- Register routing and top-level layout composition
- Expose the root shell and initial navigation flow

### Core Layer

The core layer contains cross-cutting infrastructure that should exist once for the entire application.

Responsibilities:

- Authentication infrastructure
- API client abstractions
- HTTP interceptors
- Route guards
- Global configuration and constants
- Application tokens
- Shared global services
- Non-UI utility helpers used application-wide

### Shared Layer

The shared layer contains reusable, framework-agnostic or UI-agnostic resources that are safe to reuse across multiple features.

Responsibilities:

- Shared directives
- Shared pipes
- Shared validators
- Shared UI primitives and patterns
- Shared layout helpers when they are not feature-specific
- Generic utility functions

### Features Layer

The features layer contains all business domains. Each feature owns its routes, pages, components, dialogs, services, models, interfaces, and local state.

Responsibilities:

- Implement domain-specific functionality
- Host feature-scoped state and services
- Own feature routes and lazy-loaded boundaries
- Keep business logic close to the feature that uses it

## Required Folder Structure

The project structure must remain stable and predictable. The canonical structure is:

```text
src/
  app/
  core/
    api/
    auth/
    config/
    constants/
    guards/
    interceptors/
    models/
    services/
    tokens/
    utils/
  shared/
    components/
    directives/
    pipes/
    validators/
    ui/
    icons/
    layouts/
    utils/
  features/
    auth/
    dashboard/
    users/
    teams/
    inbox/
    contacts/
    analytics/
    settings/
  layout/
    shell/
    navbar/
    sidebar/
    footer/
  assets/
    images/
    icons/
    fonts/
    translations/
  styles/
  environments/
```

Each feature directory must contain only the standard feature subfolders unless a future approved extension requires otherwise:

```text
pages/
components/
dialogs/
services/
models/
interfaces/
store/
```

## Feature-Based Architecture Rules

Every feature must be self-contained.

Rules:

- Put code in the feature that owns the behavior.
- Do not move feature code into shared or core unless it is truly cross-cutting.
- Do not create a dependency chain where one feature imports another feature directly.
- Reuse shared utilities and core services rather than duplicating logic.
- Keep feature APIs explicit through routes, inputs, outputs, and injected services.

Feature folders must remain consistent. Every feature should use the same internal shape unless a justified domain-specific extension is documented first.

Recommended feature boundaries for WaslX:

- auth: session and authentication flows
- dashboard: workspace overview and KPI surfaces
- users: user administration and invite management
- teams: team and role coordination
- inbox: conversations and message handling
- contacts: CRM-style contact management
- analytics: reporting and insights
- settings: application and workspace configuration

## Routing Strategy

Routing must be lazy-loaded and feature-owned.

Rules:

- The root app routes should remain thin.
- Each feature owns its own routes file.
- App routes should only compose feature route boundaries and shell-level routes.
- Use lazy loading for feature entry points.
- Use route guards at boundaries, not inside leaf components.
- Keep route data explicit and minimal.
- Preserve stable URL semantics for deep linking and refresh behavior.

Recommended routing model:

```text
App routes -> shell route -> lazy-loaded feature routes -> feature pages
```

Route responsibility guidelines:

- App routes: top-level composition and redirects
- Feature routes: feature-specific page entry points
- Page components: screen orchestration only
- Reusable components: no routing responsibilities

Route files should remain small and declarative. They should express composition and access boundaries, not business logic.

## State Management Strategy

State management must be feature-local by default and Signals-first.

Guidelines:

- Use Angular Signals for local and feature state.
- Keep derived state close to the consuming feature.
- Prefer simple state containers over global stores.
- Do not create global state unless the state is truly shared across multiple features.
- Keep asynchronous data loading concerns isolated in feature services.
- Use computed values for derived UI state instead of duplicated mutable fields.

State contracts should remain local to the owning feature. If a state shape becomes broadly reusable, elevate the abstraction intentionally rather than copying it.

Recommended state placement:

- Simple UI state: within components
- Feature workflow state: within feature store folders
- Cross-feature infrastructure state: core only when necessary

State organization inside a feature should remain predictable:

```text
store/
  state/
  actions/
  selectors/
```

If a feature does not need all of these folders yet, create only the ones that are genuinely required.

## Dependency Rules

Dependencies must flow inward toward the feature that owns the behavior.

Rules:

- App may depend on core, shared, layout, and features.
- Core may depend on Angular and utility primitives only.
- Shared may depend on Angular and generic helper code only.
- Features may depend on core and shared, but not on sibling feature internals.
- Pages may depend on components and feature services.
- Components should not directly depend on unrelated features.
- Services should expose focused responsibilities and avoid becoming orchestration dumping grounds.

Do not introduce circular dependencies between layers.

Implementation should always favor the nearest responsible layer. A reusable presentation concern belongs in shared, a feature workflow belongs in features, and a global concern belongs in core only when it truly has application-wide scope.

## SOLID Guidelines

### Single Responsibility Principle

Each file should have one reason to change.

Examples:

- A page orchestrates a screen.
- A component handles presentation and user interaction.
- A service handles a focused piece of business or data logic.
- A guard handles access control.

### Open/Closed Principle

Design extension points so future behavior can be added without rewriting stable code.

### Liskov Substitution Principle

Any abstraction introduced in the project must remain substitutable without changing the calling contract.

### Interface Segregation Principle

Prefer small, targeted interfaces over large generic contracts.

### Dependency Inversion Principle

High-level logic should depend on abstractions, not low-level implementation details.

## Clean Architecture Guidelines

The project should reflect clean architecture thinking even in a front-end codebase.

Layer expectations:

- Presentation concerns stay in components and pages.
- State coordination stays in feature store or feature services.
- Infrastructure concerns stay in core.
- Domain-shaping models stay close to the feature.
- Shared helpers remain generic and reusable.

Development rules:

- Keep data contracts explicit.
- Avoid leaking transport models directly into the UI when a dedicated feature model is needed.
- Avoid placing complex business rules in templates.
- Avoid mixing view state, transport state, and domain state in the same place.

## Naming Conventions

Use Angular standard naming conventions consistently.

File naming:

- Components: `something.component.ts`
- Pages: `something.page.ts`
- Services: `something.service.ts`
- API services: `something-api.service.ts`
- Models: `something.model.ts`
- Interfaces: `something.interface.ts`
- Guards: `something.guard.ts`
- Interceptors: `something.interceptor.ts`
- Routes: `feature.routes.ts`

Class and symbol naming:

- Components: PascalCase class names with `Component` suffix
- Services: PascalCase class names with `Service` suffix
- Pages: PascalCase class names with `Page` suffix
- Interfaces: PascalCase names without prefixes
- Models: PascalCase names without prefixes

Folder naming:

- Use lowercase kebab-case for files where practical.
- Keep folder names semantic and stable.
- Do not create ad hoc naming patterns per feature.

## File Organization Rules

Order code files by architectural purpose rather than by personal preference.

Recommended organization inside a feature:

1. Route file
2. Pages
3. Components
4. Dialogs
5. Services
6. Models
7. Interfaces
8. Store artifacts

Rules:

- Keep closely related code in the same feature directory.
- Avoid dumping everything into a generic `components` folder if the component is used by only one feature.
- Keep files small and purpose-driven.
- Put reusable cross-feature helpers in shared, not in feature folders.

When a feature grows, prefer introducing another focused file over expanding one file into unrelated responsibilities.

## Development Conventions

When implementing future work, follow these conventions:

- Prefer standalone Angular APIs.
- Prefer functional patterns for routing, guards, and interceptors.
- Use lazy loading by default.
- Keep templates declarative and minimal.
- Keep styles isolated and token-driven.
- Use signals for local state and feature state whenever practical.
- Keep service methods focused and named after the action they perform.
- Avoid speculative abstraction until a real reuse case exists.
- Keep public APIs of components and services stable.

Future implementation should be validated against all three foundation documents together: architecture for structure, design system for visual language, and component library for reusable UI contracts.

## Stability and Scalability Goals

This architecture is designed to support:

- Multiple authenticated workspaces
- Role-based UI and authorization rules
- Real-time inbox activity
- Administrative dashboards
- Future dark mode and theming
- Future localization
- Expansion into additional enterprise features without reworking the foundation

The architecture should remain boring in the best possible way: predictable, maintainable, and easy to scale.
