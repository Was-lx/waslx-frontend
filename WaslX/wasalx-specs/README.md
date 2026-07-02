# WasalX — Spec-Kit Bundle (120 user stories)

AI-ready specifications for the WasalX platform, generated from the Functional Requirements Specification and Sprint Plan. **Start with [`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md)** — it holds the shared architecture, actors, tech stack, and cross-cutting rules every spec assumes.

- **60** backend / full-stack stories (`US-*`)  •  **60** frontend stories (`FE-*`)  •  **120** total
- One folder per sprint; one `.md` spec per story. Each spec has a stable ID, a ClickUp link, checkable Functional Requirements + Acceptance Criteria, dependencies, and a Definition of Done.

## How to use with an AI coding agent
1. Feed `PROJECT-CONTEXT.md` as the system/grounding context.
2. Hand the agent one story spec at a time.
3. Implement against the Functional Requirements; verify against the Acceptance Criteria.
4. Respect the Dependencies order; surface any **(TBC)** item instead of inventing a rule.

## Index


### Sprint 0 — Project Setup & Foundations

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `US-0.1` | Project Scaffolding & CI Pipeline | Must (High) | [`sprint-0/US-0.1-project-scaffolding-ci-pipeline.md`](sprint-0/US-0.1-project-scaffolding-ci-pipeline.md) | [open](https://app.clickup.com/t/86caddxx1) |
| `US-0.2` | Database Schema & EF Core Models/Migrations | Must (High) | [`sprint-0/US-0.2-database-schema-ef-core-modelsmigrations.md`](sprint-0/US-0.2-database-schema-ef-core-modelsmigrations.md) | [open](https://app.clickup.com/t/86caddxxj) |
| `US-0.3` | API Gateway Skeleton | Must (High) | [`sprint-0/US-0.3-api-gateway-skeleton.md`](sprint-0/US-0.3-api-gateway-skeleton.md) | [open](https://app.clickup.com/t/86caddxy7) |
| `US-0.4` | Multi-Tenant Workspace Isolation | Must (High) | [`sprint-0/US-0.4-multitenant-workspace-isolation.md`](sprint-0/US-0.4-multitenant-workspace-isolation.md) | [open](https://app.clickup.com/t/86caddxyu) |

### Sprint 1 — Authentication, Users & Roles

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `US-1.1` | Login & Session Management (JWT) | Must (High) | [`sprint-1/US-1.1-login-session-management-jwt.md`](sprint-1/US-1.1-login-session-management-jwt.md) | [open](https://app.clickup.com/t/86caddxzy) |
| `US-1.2` | Password Reset & Account Lockout | Should (Normal) | [`sprint-1/US-1.2-password-reset-account-lockout.md`](sprint-1/US-1.2-password-reset-account-lockout.md) | [open](https://app.clickup.com/t/86caddy0k) |
| `US-1.3` | User & Role Management | Must (High) | [`sprint-1/US-1.3-user-role-management.md`](sprint-1/US-1.3-user-role-management.md) | [open](https://app.clickup.com/t/86caddy13) |
| `US-1.4` | Self-Service Profile Management | Should (Normal) | [`sprint-1/US-1.4-selfservice-profile-management.md`](sprint-1/US-1.4-selfservice-profile-management.md) | [open](https://app.clickup.com/t/86caddy1h) |
| `US-1.5` | RBAC Enforcement at API Gateway | Must (High) | [`sprint-1/US-1.5-rbac-enforcement-at-api-gateway.md`](sprint-1/US-1.5-rbac-enforcement-at-api-gateway.md) | [open](https://app.clickup.com/t/86caddy23) |
| `US-1.6` | Data Encryption & Tenant Plan Link | Must (High) | [`sprint-1/US-1.6-data-encryption-tenant-plan-link.md`](sprint-1/US-1.6-data-encryption-tenant-plan-link.md) | [open](https://app.clickup.com/t/86caddy2n) |

### Sprint 2 — WhatsApp Integration & Shared Inbox

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `US-2.1` | Connect WhatsApp Business Number (Cloud API) | Must (High) | [`sprint-2/US-2.1-connect-whatsapp-business-number-cloud-api.md`](sprint-2/US-2.1-connect-whatsapp-business-number-cloud-api.md) | [open](https://app.clickup.com/t/86caddy37) |
| `US-2.2` | Receive Inbound Messages via Webhook | Must (High) | [`sprint-2/US-2.2-receive-inbound-messages-via-webhook.md`](sprint-2/US-2.2-receive-inbound-messages-via-webhook.md) | [open](https://app.clickup.com/t/86caddy3q) |
| `US-2.3` | Send Outbound Messages (24h Window, Templates, Rate Limits) | Must (High) | [`sprint-2/US-2.3-send-outbound-messages-24h-window-templates-rate-limits.md`](sprint-2/US-2.3-send-outbound-messages-24h-window-templates-rate-limits.md) | [open](https://app.clickup.com/t/86caddy44) |
| `US-2.4` | Media Messages & Delivery/Read Receipts | Should (Normal) | [`sprint-2/US-2.4-media-messages-deliveryread-receipts.md`](sprint-2/US-2.4-media-messages-deliveryread-receipts.md) | [open](https://app.clickup.com/t/86caddy4e) |
| `US-2.5` | Shared Team Inbox with Chat View & Context Panel | Must (High) | [`sprint-2/US-2.5-shared-team-inbox-with-chat-view-context-panel.md`](sprint-2/US-2.5-shared-team-inbox-with-chat-view-context-panel.md) | [open](https://app.clickup.com/t/86caddy4r) |
| `US-2.6` | Internal Team Notes | Must (High) | [`sprint-2/US-2.6-internal-team-notes.md`](sprint-2/US-2.6-internal-team-notes.md) | [open](https://app.clickup.com/t/86caddy57) |
| `US-2.7` | Real-Time Inbox Updates (SignalR) | Must (High) | [`sprint-2/US-2.7-realtime-inbox-updates-signalr.md`](sprint-2/US-2.7-realtime-inbox-updates-signalr.md) | [open](https://app.clickup.com/t/86caddy5j) |
| `US-2.8` | Conversation Lifecycle & Status State Machine | Must (High) | [`sprint-2/US-2.8-conversation-lifecycle-status-state-machine.md`](sprint-2/US-2.8-conversation-lifecycle-status-state-machine.md) | [open](https://app.clickup.com/t/86caddy5z) |

### Sprint 3 — Assignment, Groups/Stages & Tags

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `US-3.1` | Manual Assignment & Reassignment with History | Must (High) | [`sprint-3/US-3.1-manual-assignment-reassignment-with-history.md`](sprint-3/US-3.1-manual-assignment-reassignment-with-history.md) | [open](https://app.clickup.com/t/86caddy6k) |
| `US-3.2` | Round Robin Auto-Distribution | Must (High) | [`sprint-3/US-3.2-round-robin-autodistribution.md`](sprint-3/US-3.2-round-robin-autodistribution.md) | [open](https://app.clickup.com/t/86caddy75) |
| `US-3.3` | Unassigned Queue & Workload Balancing | Should (Normal) | [`sprint-3/US-3.3-unassigned-queue-workload-balancing.md`](sprint-3/US-3.3-unassigned-queue-workload-balancing.md) | [open](https://app.clickup.com/t/86caddy7f) |
| `US-3.4` | Groups/Teams & Agent Membership | Must (High) | [`sprint-3/US-3.4-groupsteams-agent-membership.md`](sprint-3/US-3.4-groupsteams-agent-membership.md) | [open](https://app.clickup.com/t/86caddy7v) |
| `US-3.5` | Route Conversations to Groups with Stages | Must (High) | [`sprint-3/US-3.5-route-conversations-to-groups-with-stages.md`](sprint-3/US-3.5-route-conversations-to-groups-with-stages.md) | [open](https://app.clickup.com/t/86caddy8a) |
| `US-3.6` | Cross-Team Stage Handoff (Sales → Operations) | Must (High) | [`sprint-3/US-3.6-crossteam-stage-handoff-sales-operations.md`](sprint-3/US-3.6-crossteam-stage-handoff-sales-operations.md) | [open](https://app.clickup.com/t/86caddy9w) |
| `US-3.7` | Tags: Create, Apply & Remove | Must (High) | [`sprint-3/US-3.7-tags-create-apply-remove.md`](sprint-3/US-3.7-tags-create-apply-remove.md) | [open](https://app.clickup.com/t/86caddybc) |
| `US-3.8` | AI Auto-Tagging | Should (Normal) | [`sprint-3/US-3.8-ai-autotagging.md`](sprint-3/US-3.8-ai-autotagging.md) | [open](https://app.clickup.com/t/86caddydf) |
| `US-3.9` | Filtering & Search | Should (Normal) | [`sprint-3/US-3.9-filtering-search.md`](sprint-3/US-3.9-filtering-search.md) | [open](https://app.clickup.com/t/86caddyfy) |

### Sprint 4 — AI Pipeline: RAG + Routing + Reply

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `US-4.1` | RAG Memory Layer | Must (High) | [`sprint-4/US-4.1-rag-memory-layer.md`](sprint-4/US-4.1-rag-memory-layer.md) | [open](https://app.clickup.com/t/86caddygy) |
| `US-4.2` | Agent Natural-Language Customer Query | Should (Normal) | [`sprint-4/US-4.2-agent-naturallanguage-customer-query.md`](sprint-4/US-4.2-agent-naturallanguage-customer-query.md) | [open](https://app.clickup.com/t/86caddyh6) |
| `US-4.3` | AI Routing: Classification & Decision Object | Must (High) | [`sprint-4/US-4.3-ai-routing-classification-decision-object.md`](sprint-4/US-4.3-ai-routing-classification-decision-object.md) | [open](https://app.clickup.com/t/86caddyjz) |
| `US-4.4` | Agent Scoring & Smart Selection | Must (High) | [`sprint-4/US-4.4-agent-scoring-smart-selection.md`](sprint-4/US-4.4-agent-scoring-smart-selection.md) | [open](https://app.clickup.com/t/86caddykf) |
| `US-4.5` | Auto-Escalation of Urgent/VIP/Angry | Must (High) | [`sprint-4/US-4.5-autoescalation-of-urgentvipangry.md`](sprint-4/US-4.5-autoescalation-of-urgentvipangry.md) | [open](https://app.clickup.com/t/86caddym5) |
| `US-4.6` | Recommend-Only vs Auto-Assign Mode | Must (High) | [`sprint-4/US-4.6-recommendonly-vs-autoassign-mode.md`](sprint-4/US-4.6-recommendonly-vs-autoassign-mode.md) | [open](https://app.clickup.com/t/86caddymt) |
| `US-4.7` | Off-Hours Acknowledgment & FAQ Auto-Resolve | Should (Normal) | [`sprint-4/US-4.7-offhours-acknowledgment-faq-autoresolve.md`](sprint-4/US-4.7-offhours-acknowledgment-faq-autoresolve.md) | [open](https://app.clickup.com/t/86caddynq) |
| `US-4.8` | LLM Reply Suggestion Engine (1–3, Never Auto-Send) | Must (High) | [`sprint-4/US-4.8-llm-reply-suggestion-engine-13-never-autosend.md`](sprint-4/US-4.8-llm-reply-suggestion-engine-13-never-autosend.md) | [open](https://app.clickup.com/t/86caddypb) |
| `US-4.9` | AI Conversation Summary on Handoff | Must (High) | [`sprint-4/US-4.9-ai-conversation-summary-on-handoff.md`](sprint-4/US-4.9-ai-conversation-summary-on-handoff.md) | [open](https://app.clickup.com/t/86caddypv) |
| `US-4.10` | Backend Orchestrator & Agent Performance Metrics | Must (High) | [`sprint-4/US-4.10-backend-orchestrator-agent-performance-metrics.md`](sprint-4/US-4.10-backend-orchestrator-agent-performance-metrics.md) | [open](https://app.clickup.com/t/86caddyqc) |

### Sprint 5 — Campaigns, Reporting, Notifications & Audit

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `US-5.1` | Campaign Builder (Template & Audience) | Must (High) | [`sprint-5/US-5.1-campaign-builder-template-audience.md`](sprint-5/US-5.1-campaign-builder-template-audience.md) | [open](https://app.clickup.com/t/86caddyr7) |
| `US-5.2` | Campaign Scheduling & Send Engine | Must (High) | [`sprint-5/US-5.2-campaign-scheduling-send-engine.md`](sprint-5/US-5.2-campaign-scheduling-send-engine.md) | [open](https://app.clickup.com/t/86caddytc) |
| `US-5.3` | Campaign Analytics & Controls | Must (High) | [`sprint-5/US-5.3-campaign-analytics-controls.md`](sprint-5/US-5.3-campaign-analytics-controls.md) | [open](https://app.clickup.com/t/86cadf4hv) |
| `US-5.4` | Reporting & Analytics Dashboards | Must (High) | [`sprint-5/US-5.4-reporting-analytics-dashboards.md`](sprint-5/US-5.4-reporting-analytics-dashboards.md) | [open](https://app.clickup.com/t/86cadf4ju) |
| `US-5.5` | Report Export (CSV/PDF) | Could (Low) | [`sprint-5/US-5.5-report-export-csvpdf.md`](sprint-5/US-5.5-report-export-csvpdf.md) | [open](https://app.clickup.com/t/86cadf4kn) |
| `US-5.6` | Real-Time & Browser Notifications | Should (Normal) | [`sprint-5/US-5.6-realtime-browser-notifications.md`](sprint-5/US-5.6-realtime-browser-notifications.md) | [open](https://app.clickup.com/t/86cadf4mk) |
| `US-5.7` | Audit Logs (Tenant) | Must (High) | [`sprint-5/US-5.7-audit-logs-tenant.md`](sprint-5/US-5.7-audit-logs-tenant.md) | [open](https://app.clickup.com/t/86cadf4pa) |

### Sprint 6 — Platform Owner Console (Super Admin)

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `US-6.1` | Platform Console & Super-Admin User Management | Must (High) | [`sprint-6/US-6.1-platform-console-superadmin-user-management.md`](sprint-6/US-6.1-platform-console-superadmin-user-management.md) | [open](https://app.clickup.com/t/86cadf4rw) |
| `US-6.2` | Tenant Lifecycle Management | Must (High) | [`sprint-6/US-6.2-tenant-lifecycle-management.md`](sprint-6/US-6.2-tenant-lifecycle-management.md) | [open](https://app.clickup.com/t/86cadf4u9) |
| `US-6.3` | Subscription Plans, Billing & Invoicing | Must (High) | [`sprint-6/US-6.3-subscription-plans-billing-invoicing.md`](sprint-6/US-6.3-subscription-plans-billing-invoicing.md) | [open](https://app.clickup.com/t/86cadf4wd) |
| `US-6.4` | Global Usage Dashboards | Must (High) | [`sprint-6/US-6.4-global-usage-dashboards.md`](sprint-6/US-6.4-global-usage-dashboards.md) | [open](https://app.clickup.com/t/86cadf4xt) |
| `US-6.5` | AI Usage & Cost Monitoring | Should (Normal) | [`sprint-6/US-6.5-ai-usage-cost-monitoring.md`](sprint-6/US-6.5-ai-usage-cost-monitoring.md) | [open](https://app.clickup.com/t/86cadf4za) |
| `US-6.6` | Platform Credentials & Secrets Management | Must (High) | [`sprint-6/US-6.6-platform-credentials-secrets-management.md`](sprint-6/US-6.6-platform-credentials-secrets-management.md) | [open](https://app.clickup.com/t/86cadf513) |
| `US-6.7` | Feature Flags & Global Policy Defaults | Should (Normal) | [`sprint-6/US-6.7-feature-flags-global-policy-defaults.md`](sprint-6/US-6.7-feature-flags-global-policy-defaults.md) | [open](https://app.clickup.com/t/86cadf530) |
| `US-6.8` | Audited Tenant Impersonation | Should (Normal) | [`sprint-6/US-6.8-audited-tenant-impersonation.md`](sprint-6/US-6.8-audited-tenant-impersonation.md) | [open](https://app.clickup.com/t/86cadf54g) |
| `US-6.9` | Global Cross-Tenant Audit Log | Must (High) | [`sprint-6/US-6.9-global-crosstenant-audit-log.md`](sprint-6/US-6.9-global-crosstenant-audit-log.md) | [open](https://app.clickup.com/t/86cadf579) |
| `US-6.10` | System Health Monitoring & Announcements | Should (Normal) | [`sprint-6/US-6.10-system-health-monitoring-announcements.md`](sprint-6/US-6.10-system-health-monitoring-announcements.md) | [open](https://app.clickup.com/t/86cadf590) |

### Sprint 7 — Hardening, NFRs & Launch

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `US-7.1` | Pipeline Latency Tuning & Load/Scalability Testing | Must (High) | [`sprint-7/US-7.1-pipeline-latency-tuning-loadscalability-testing.md`](sprint-7/US-7.1-pipeline-latency-tuning-loadscalability-testing.md) | [open](https://app.clickup.com/t/86cadf5bb) |
| `US-7.2` | Graceful Degradation & Fallbacks | Must (High) | [`sprint-7/US-7.2-graceful-degradation-fallbacks.md`](sprint-7/US-7.2-graceful-degradation-fallbacks.md) | [open](https://app.clickup.com/t/86cadf5d5) |
| `US-7.3` | Security Review & Data Retention | Must (High) | [`sprint-7/US-7.3-security-review-data-retention.md`](sprint-7/US-7.3-security-review-data-retention.md) | [open](https://app.clickup.com/t/86cadf5fn) |
| `US-7.4` | Arabic/English Localization QA | Must (High) | [`sprint-7/US-7.4-arabicenglish-localization-qa.md`](sprint-7/US-7.4-arabicenglish-localization-qa.md) | [open](https://app.clickup.com/t/86cadf5ha) |
| `US-7.5` | End-to-End Testing, Bug Fixing & Documentation | Must (High) | [`sprint-7/US-7.5-endtoend-testing-bug-fixing-documentation.md`](sprint-7/US-7.5-endtoend-testing-bug-fixing-documentation.md) | [open](https://app.clickup.com/t/86cadf5k6) |
| `US-7.6` | Deployment & v1.0 Release | Must (High) | [`sprint-7/US-7.6-deployment-v10-release.md`](sprint-7/US-7.6-deployment-v10-release.md) | [open](https://app.clickup.com/t/86cadf5mr) |

### Sprint 0 — Project Setup & Foundations

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `FE-0.1` | Angular App Shell & Base Layout | Must (High) | [`sprint-0/FE-0.1-angular-app-shell-base-layout.md`](sprint-0/FE-0.1-angular-app-shell-base-layout.md) | [open](https://app.clickup.com/t/86cae063x) |
| `FE-0.2` | Routing, Auth Guards & JWT HTTP Interceptor | Must (High) | [`sprint-0/FE-0.2-routing-auth-guards-jwt-http-interceptor.md`](sprint-0/FE-0.2-routing-auth-guards-jwt-http-interceptor.md) | [open](https://app.clickup.com/t/86cae064e) |
| `FE-0.3` | Design System, Theming & RTL/i18n Setup | Must (High) | [`sprint-0/FE-0.3-design-system-theming-rtli18n-setup.md`](sprint-0/FE-0.3-design-system-theming-rtli18n-setup.md) | [open](https://app.clickup.com/t/86cae064v) |
| `FE-0.4` | Global Error Handling & Toast Notification Service | Should (Normal) | [`sprint-0/FE-0.4-global-error-handling-toast-notification-service.md`](sprint-0/FE-0.4-global-error-handling-toast-notification-service.md) | [open](https://app.clickup.com/t/86cae065g) |

### Sprint 1 — Authentication, Users & Roles

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `FE-1.1` | Login & Session UI | Must (High) | [`sprint-1/FE-1.1-login-session-ui.md`](sprint-1/FE-1.1-login-session-ui.md) | [open](https://app.clickup.com/t/86cae0664) |
| `FE-1.2` | Password Reset & Lockout UI | Should (Normal) | [`sprint-1/FE-1.2-password-reset-lockout-ui.md`](sprint-1/FE-1.2-password-reset-lockout-ui.md) | [open](https://app.clickup.com/t/86cae066z) |
| `FE-1.3` | User Management Screens (List / Create / Invite) | Must (High) | [`sprint-1/FE-1.3-user-management-screens-list-create-invite.md`](sprint-1/FE-1.3-user-management-screens-list-create-invite.md) | [open](https://app.clickup.com/t/86cae067g) |
| `FE-1.4` | Role Assignment & Activate/Deactivate UI | Must (High) | [`sprint-1/FE-1.4-role-assignment-activatedeactivate-ui.md`](sprint-1/FE-1.4-role-assignment-activatedeactivate-ui.md) | [open](https://app.clickup.com/t/86cae0688) |
| `FE-1.5` | Profile & Password Settings UI | Should (Normal) | [`sprint-1/FE-1.5-profile-password-settings-ui.md`](sprint-1/FE-1.5-profile-password-settings-ui.md) | [open](https://app.clickup.com/t/86cae068u) |
| `FE-1.6` | Permission-Based UI Rendering (RBAC Directives) | Must (High) | [`sprint-1/FE-1.6-permissionbased-ui-rendering-rbac-directives.md`](sprint-1/FE-1.6-permissionbased-ui-rendering-rbac-directives.md) | [open](https://app.clickup.com/t/86cae069v) |
| `FE-1.7` | Tenant Onboarding / First-Run Setup UI | Should (Normal) | [`sprint-1/FE-1.7-tenant-onboarding-firstrun-setup-ui.md`](sprint-1/FE-1.7-tenant-onboarding-firstrun-setup-ui.md) | [open](https://app.clickup.com/t/86cae06a8) |

### Sprint 2 — WhatsApp Integration & Shared Inbox

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `FE-2.1` | Connect WhatsApp Number UI & Health Status | Should (Normal) | [`sprint-2/FE-2.1-connect-whatsapp-number-ui-health-status.md`](sprint-2/FE-2.1-connect-whatsapp-number-ui-health-status.md) | [open](https://app.clickup.com/t/86cae06b4) |
| `FE-2.2` | Inbox List & Conversation Navigation | Must (High) | [`sprint-2/FE-2.2-inbox-list-conversation-navigation.md`](sprint-2/FE-2.2-inbox-list-conversation-navigation.md) | [open](https://app.clickup.com/t/86cae06bx) |
| `FE-2.3` | Chat View — Message Bubbles & Threading | Must (High) | [`sprint-2/FE-2.3-chat-view-message-bubbles-threading.md`](sprint-2/FE-2.3-chat-view-message-bubbles-threading.md) | [open](https://app.clickup.com/t/86cae06cr) |
| `FE-2.4` | Chat View — Media Rendering (Image / Doc / Audio) | Should (Normal) | [`sprint-2/FE-2.4-chat-view-media-rendering-image-doc-audio.md`](sprint-2/FE-2.4-chat-view-media-rendering-image-doc-audio.md) | [open](https://app.clickup.com/t/86cae06df) |
| `FE-2.5` | Message Composer — Text & Send UX | Must (High) | [`sprint-2/FE-2.5-message-composer-text-send-ux.md`](sprint-2/FE-2.5-message-composer-text-send-ux.md) | [open](https://app.clickup.com/t/86cae06e0) |
| `FE-2.6` | Message Composer — Media Upload | Should (Normal) | [`sprint-2/FE-2.6-message-composer-media-upload.md`](sprint-2/FE-2.6-message-composer-media-upload.md) | [open](https://app.clickup.com/t/86cae06ed) |
| `FE-2.7` | Template Picker & 24-Hour Window UX | Must (High) | [`sprint-2/FE-2.7-template-picker-24hour-window-ux.md`](sprint-2/FE-2.7-template-picker-24hour-window-ux.md) | [open](https://app.clickup.com/t/86cae06f0) |
| `FE-2.8` | Customer Context Panel | Should (Normal) | [`sprint-2/FE-2.8-customer-context-panel.md`](sprint-2/FE-2.8-customer-context-panel.md) | [open](https://app.clickup.com/t/86cae06ff) |
| `FE-2.9` | Internal Notes UI | Must (High) | [`sprint-2/FE-2.9-internal-notes-ui.md`](sprint-2/FE-2.9-internal-notes-ui.md) | [open](https://app.clickup.com/t/86cae06fn) |
| `FE-2.10` | SignalR Client Integration (Real-Time Inbox) | Must (High) | [`sprint-2/FE-2.10-signalr-client-integration-realtime-inbox.md`](sprint-2/FE-2.10-signalr-client-integration-realtime-inbox.md) | [open](https://app.clickup.com/t/86cae06g0) |
| `FE-2.11` | Delivery/Read Receipt Indicators | Should (Normal) | [`sprint-2/FE-2.11-deliveryread-receipt-indicators.md`](sprint-2/FE-2.11-deliveryread-receipt-indicators.md) | [open](https://app.clickup.com/t/86cae06gk) |
| `FE-2.12` | Conversation Status Controls (State Machine UI) | Must (High) | [`sprint-2/FE-2.12-conversation-status-controls-state-machine-ui.md`](sprint-2/FE-2.12-conversation-status-controls-state-machine-ui.md) | [open](https://app.clickup.com/t/86cae06h4) |

### Sprint 3 — Assignment, Groups/Stages & Tags

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `FE-3.1` | Assignment & Reassignment UI (Reason + History) | Must (High) | [`sprint-3/FE-3.1-assignment-reassignment-ui-reason-history.md`](sprint-3/FE-3.1-assignment-reassignment-ui-reason-history.md) | [open](https://app.clickup.com/t/86cae06hp) |
| `FE-3.2` | Unassigned Queue View | Should (Normal) | [`sprint-3/FE-3.2-unassigned-queue-view.md`](sprint-3/FE-3.2-unassigned-queue-view.md) | [open](https://app.clickup.com/t/86cae06j3) |
| `FE-3.3` | Groups/Teams Management UI | Must (High) | [`sprint-3/FE-3.3-groupsteams-management-ui.md`](sprint-3/FE-3.3-groupsteams-management-ui.md) | [open](https://app.clickup.com/t/86cae06j9) |
| `FE-3.4` | Stage/Pipeline Board UI | Must (High) | [`sprint-3/FE-3.4-stagepipeline-board-ui.md`](sprint-3/FE-3.4-stagepipeline-board-ui.md) | [open](https://app.clickup.com/t/86cae06jn) |
| `FE-3.5` | Cross-Team Handoff UI | Must (High) | [`sprint-3/FE-3.5-crossteam-handoff-ui.md`](sprint-3/FE-3.5-crossteam-handoff-ui.md) | [open](https://app.clickup.com/t/86cae06ka) |
| `FE-3.6` | Tag Management & Apply/Remove UI | Must (High) | [`sprint-3/FE-3.6-tag-management-applyremove-ui.md`](sprint-3/FE-3.6-tag-management-applyremove-ui.md) | [open](https://app.clickup.com/t/86cae06kn) |
| `FE-3.7` | Filters & Search Bar (Saved Views) | Should (Normal) | [`sprint-3/FE-3.7-filters-search-bar-saved-views.md`](sprint-3/FE-3.7-filters-search-bar-saved-views.md) | [open](https://app.clickup.com/t/86cae06mj) |

### Sprint 4 — AI Pipeline: RAG + Routing + Reply

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `FE-4.1` | AI Reply Suggestions Panel (Accept / Edit / Dismiss) | Must (High) | [`sprint-4/FE-4.1-ai-reply-suggestions-panel-accept-edit-dismiss.md`](sprint-4/FE-4.1-ai-reply-suggestions-panel-accept-edit-dismiss.md) | [open](https://app.clickup.com/t/86cae06p1) |
| `FE-4.2` | AI Routing Recommendation Display & Confirm | Must (High) | [`sprint-4/FE-4.2-ai-routing-recommendation-display-confirm.md`](sprint-4/FE-4.2-ai-routing-recommendation-display-confirm.md) | [open](https://app.clickup.com/t/86cae06q1) |
| `FE-4.3` | Agent Natural-Language Customer Query UI | Should (Normal) | [`sprint-4/FE-4.3-agent-naturallanguage-customer-query-ui.md`](sprint-4/FE-4.3-agent-naturallanguage-customer-query-ui.md) | [open](https://app.clickup.com/t/86cae06qg) |
| `FE-4.4` | Conversation Summary Display (Handoff + On-Demand) | Must (High) | [`sprint-4/FE-4.4-conversation-summary-display-handoff-ondemand.md`](sprint-4/FE-4.4-conversation-summary-display-handoff-ondemand.md) | [open](https://app.clickup.com/t/86cae06qw) |
| `FE-4.5` | Escalation, VIP & Sentiment Badges | Should (Normal) | [`sprint-4/FE-4.5-escalation-vip-sentiment-badges.md`](sprint-4/FE-4.5-escalation-vip-sentiment-badges.md) | [open](https://app.clickup.com/t/86cae06ra) |
| `FE-4.6` | AI Pipeline Loading/Latency UX | Should (Normal) | [`sprint-4/FE-4.6-ai-pipeline-loadinglatency-ux.md`](sprint-4/FE-4.6-ai-pipeline-loadinglatency-ux.md) | [open](https://app.clickup.com/t/86cae06rw) |
| `FE-4.7` | Off-Hours / FAQ Auto-Reply Configuration UI | Should (Normal) | [`sprint-4/FE-4.7-offhours-faq-autoreply-configuration-ui.md`](sprint-4/FE-4.7-offhours-faq-autoreply-configuration-ui.md) | [open](https://app.clickup.com/t/86cae06t7) |

### Sprint 5 — Campaigns, Reporting, Notifications & Audit

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `FE-5.1` | Campaign Builder Wizard | Must (High) | [`sprint-5/FE-5.1-campaign-builder-wizard.md`](sprint-5/FE-5.1-campaign-builder-wizard.md) | [open](https://app.clickup.com/t/86cae06tt) |
| `FE-5.2` | Audience Selector UI | Must (High) | [`sprint-5/FE-5.2-audience-selector-ui.md`](sprint-5/FE-5.2-audience-selector-ui.md) | [open](https://app.clickup.com/t/86cae06ub) |
| `FE-5.3` | Campaign Scheduling & Status Dashboard | Must (High) | [`sprint-5/FE-5.3-campaign-scheduling-status-dashboard.md`](sprint-5/FE-5.3-campaign-scheduling-status-dashboard.md) | [open](https://app.clickup.com/t/86cae06v4) |
| `FE-5.4` | Campaign Analytics & Controls UI | Should (Normal) | [`sprint-5/FE-5.4-campaign-analytics-controls-ui.md`](sprint-5/FE-5.4-campaign-analytics-controls-ui.md) | [open](https://app.clickup.com/t/86cae06wb) |
| `FE-5.5` | Reporting & Analytics Dashboards (Charts) | Must (High) | [`sprint-5/FE-5.5-reporting-analytics-dashboards-charts.md`](sprint-5/FE-5.5-reporting-analytics-dashboards-charts.md) | [open](https://app.clickup.com/t/86cae06x1) |
| `FE-5.6` | Report Export UI | Could (Low) | [`sprint-5/FE-5.6-report-export-ui.md`](sprint-5/FE-5.6-report-export-ui.md) | [open](https://app.clickup.com/t/86cae06xe) |
| `FE-5.7` | Notifications Center & Browser Notifications | Should (Normal) | [`sprint-5/FE-5.7-notifications-center-browser-notifications.md`](sprint-5/FE-5.7-notifications-center-browser-notifications.md) | [open](https://app.clickup.com/t/86cae06y0) |
| `FE-5.8` | Tenant Audit Log Viewer | Should (Normal) | [`sprint-5/FE-5.8-tenant-audit-log-viewer.md`](sprint-5/FE-5.8-tenant-audit-log-viewer.md) | [open](https://app.clickup.com/t/86cae06yk) |

### Sprint 6 — Platform Owner Console (Super Admin)

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `FE-6.1` | Platform Console Shell & Super-Admin Auth UI | Must (High) | [`sprint-6/FE-6.1-platform-console-shell-superadmin-auth-ui.md`](sprint-6/FE-6.1-platform-console-shell-superadmin-auth-ui.md) | [open](https://app.clickup.com/t/86cae06zm) |
| `FE-6.2` | Tenant Management UI (Lifecycle) | Must (High) | [`sprint-6/FE-6.2-tenant-management-ui-lifecycle.md`](sprint-6/FE-6.2-tenant-management-ui-lifecycle.md) | [open](https://app.clickup.com/t/86cae0701) |
| `FE-6.3` | Plans & Subscription Management UI | Must (High) | [`sprint-6/FE-6.3-plans-subscription-management-ui.md`](sprint-6/FE-6.3-plans-subscription-management-ui.md) | [open](https://app.clickup.com/t/86cae070v) |
| `FE-6.4` | Billing & Invoicing UI | Must (High) | [`sprint-6/FE-6.4-billing-invoicing-ui.md`](sprint-6/FE-6.4-billing-invoicing-ui.md) | [open](https://app.clickup.com/t/86cae071f) |
| `FE-6.5` | Global Usage Dashboards UI | Must (High) | [`sprint-6/FE-6.5-global-usage-dashboards-ui.md`](sprint-6/FE-6.5-global-usage-dashboards-ui.md) | [open](https://app.clickup.com/t/86cae071t) |
| `FE-6.6` | AI Cost Monitoring UI | Should (Normal) | [`sprint-6/FE-6.6-ai-cost-monitoring-ui.md`](sprint-6/FE-6.6-ai-cost-monitoring-ui.md) | [open](https://app.clickup.com/t/86cae07f2) |
| `FE-6.7` | Platform Settings UI (Credentials, Feature Flags, Policy) | Should (Normal) | [`sprint-6/FE-6.7-platform-settings-ui-credentials-feature-flags-policy.md`](sprint-6/FE-6.7-platform-settings-ui-credentials-feature-flags-policy.md) | [open](https://app.clickup.com/t/86cae07jd) |
| `FE-6.8` | Impersonation Controls UI | Should (Normal) | [`sprint-6/FE-6.8-impersonation-controls-ui.md`](sprint-6/FE-6.8-impersonation-controls-ui.md) | [open](https://app.clickup.com/t/86cae07m7) |
| `FE-6.9` | Global Audit Log & System Health UI | Should (Normal) | [`sprint-6/FE-6.9-global-audit-log-system-health-ui.md`](sprint-6/FE-6.9-global-audit-log-system-health-ui.md) | [open](https://app.clickup.com/t/86cae07pv) |

### Sprint 7 — Hardening, NFRs & Launch

| ID | Story | Priority | Spec | ClickUp |
|---|---|---|---|---|
| `FE-7.1` | Frontend Performance Optimization | Must (High) | [`sprint-7/FE-7.1-frontend-performance-optimization.md`](sprint-7/FE-7.1-frontend-performance-optimization.md) | [open](https://app.clickup.com/t/86cae07uf) |
| `FE-7.2` | RTL/Localization QA & Polish (Arabic/English) | Must (High) | [`sprint-7/FE-7.2-rtllocalization-qa-polish-arabicenglish.md`](sprint-7/FE-7.2-rtllocalization-qa-polish-arabicenglish.md) | [open](https://app.clickup.com/t/86cae07wk) |
| `FE-7.3` | Accessibility & Responsive QA | Should (Normal) | [`sprint-7/FE-7.3-accessibility-responsive-qa.md`](sprint-7/FE-7.3-accessibility-responsive-qa.md) | [open](https://app.clickup.com/t/86cae0801) |
| `FE-7.4` | Cross-Browser & Mobile-Web QA | Should (Normal) | [`sprint-7/FE-7.4-crossbrowser-mobileweb-qa.md`](sprint-7/FE-7.4-crossbrowser-mobileweb-qa.md) | [open](https://app.clickup.com/t/86cae0842) |
| `FE-7.5` | Graceful Degradation UX (AI/API-Down States) | Must (High) | [`sprint-7/FE-7.5-graceful-degradation-ux-aiapidown-states.md`](sprint-7/FE-7.5-graceful-degradation-ux-aiapidown-states.md) | [open](https://app.clickup.com/t/86cae086v) |
| `FE-7.6` | Frontend E2E Tests & Release Prep | Must (High) | [`sprint-7/FE-7.6-frontend-e2e-tests-release-prep.md`](sprint-7/FE-7.6-frontend-e2e-tests-release-prep.md) | [open](https://app.clickup.com/t/86cae0899) |
