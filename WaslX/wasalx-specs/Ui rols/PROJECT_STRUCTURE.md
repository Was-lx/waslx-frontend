# Angular Enterprise Architecture Setup

You are a Senior Angular Software Architect with extensive experience building enterprise-grade SaaS applications.

Your task is to create ONLY the project architecture and folder structure.

Do NOT implement any business logic.
Do NOT create UI designs.
Do NOT connect APIs.
Do NOT write feature implementations.

Your responsibility is only to build a clean, scalable, production-ready architecture that follows Angular best practices.

## Angular Version

Use the latest stable Angular version.

Requirements:

- Standalone Components only.
- Functional Routing.
- Functional Guards.
- Functional Interceptors.
- Signals support.
- Lazy Loading.
- Modern Angular project structure.
- Strict TypeScript.
- Clean Architecture principles.
- Feature-Based Architecture.
- SOLID principles.
- Scalable for large SaaS applications.

---

# Folder Structure

Create the following structure exactly.

```
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
        pages/
        components/
        dialogs/
        services/
        models/
        interfaces/
        store/
        guards/
        auth.routes.ts

    dashboard/
        pages/
        widgets/
        components/
        services/
        models/
        interfaces/
        store/
        dashboard.routes.ts

    users/
        pages/
        components/
        dialogs/
        services/
        models/
        interfaces/
        store/
        users.routes.ts

    teams/
        pages/
        components/
        dialogs/
        services/
        models/
        interfaces/
        store/
        teams.routes.ts

    inbox/
        pages/
        components/
        dialogs/
        services/
        models/
        interfaces/
        store/
        inbox.routes.ts

    contacts/
        pages/
        components/
        dialogs/
        services/
        models/
        interfaces/
        store/
        contacts.routes.ts

    analytics/
        pages/
        components/
        widgets/
        services/
        models/
        interfaces/
        store/
        analytics.routes.ts

    settings/
        pages/
        components/
        dialogs/
        services/
        models/
        interfaces/
        store/
        settings.routes.ts

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

app.config.ts

app.routes.ts

main.ts
```

---

# Every Feature Must Contain

Each feature should include empty folders only.

```
components/

pages/

dialogs/

services/

models/

interfaces/

store/
```

Create placeholder files only where Angular requires them.

No implementation.

---

# Components

Create empty standalone components only.

No HTML.

No CSS.

No business logic.

Each component should contain only the minimum Angular boilerplate required to compile.

---

# Services

Generate empty injectable services.

No HTTP methods.

No API calls.

No implementation.

---

# Models

Create empty model files.

Example:

```
user.model.ts

team.model.ts

contact.model.ts
```

No properties.

---

# Interfaces

Create empty interfaces.

Example

```
user.interface.ts

team.interface.ts
```

No properties.

---

# Store

Create an empty state management structure using Signals.

Folders only.

No implementation.

Example

```
state/

actions/

selectors/
```

---

# Routing

Every feature must have its own routes file.

Example

```
users.routes.ts

dashboard.routes.ts

settings.routes.ts
```

Configure Lazy Loading only.

Do not create page logic.

---

# Core Layer

Generate only architecture.

```
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
```

Create placeholder files where appropriate.

No implementation.

---

# Shared Layer

Generate folders for reusable resources.

```
components/

ui/

pipes/

directives/

validators/

icons/

layouts/

utils/
```

Do not create reusable components.

Folders only.

---

# Layout

Generate

```
Navbar

Sidebar

Footer

Shell
```

Standalone components only.

No HTML design.

No styling.

---

# Assets

Create folders only.

```
fonts/

icons/

images/

translations/
```

---

# Environment

Generate

```
environment.ts

environment.development.ts
```

Only export empty configuration objects.

---

# Naming Convention

Use Angular official naming conventions.

Examples

```
user.service.ts

user.component.ts

dashboard.page.ts

team.model.ts

auth.guard.ts

auth.interceptor.ts

users.routes.ts
```

---

# Coding Rules

- No TODO comments.
- No fake data.
- No sample APIs.
- No mock services.
- No console.log().
- No comments unless required.
- No placeholder HTML.
- No placeholder CSS.
- No business logic.
- No RxJS implementation.
- No HTTP implementation.

Everything should remain empty and ready for future development.

---

# Final Goal

Produce a production-ready Angular project architecture suitable for a large enterprise SaaS platform.

The project must compile successfully while containing only the architectural skeleton.

Think like a Software Architect, not a Feature Developer.

Your output should be ONLY the project structure and minimal Angular boilerplate required for compilation.

Do not add any extra features beyond the architecture.
