import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiClientService } from './api-client.service';
import type { EscalationRecommendation } from '../../features/inbox/models/escalation-recommendation.model';

// ─────────────────────────────────────────────────────────────────────────────
// AI Agent control + oversight API (FE-4.1) and escalation recommendation (FE-4.2).
//
// ⚠️ PROVISIONAL ENDPOINTS. The backing backend stories (US-4.6 AI Agent, US-4.2/4.5 escalation)
// do not exist yet, so every path below is a best-guess placeholder marked `TODO(US-x.y)`. Re-point
// these to the real routes once the endpoints land. Components consuming this service must degrade
// gracefully (empty/hidden state) while the endpoints 404.
// ─────────────────────────────────────────────────────────────────────────────

/** AI Agent behaviour + enablement settings (mirrors the future settings DTO). */
export interface AiAgentSettings {
  enabled: boolean;
  /** Per-WhatsApp-number overrides of the workspace-level toggle. */
  perNumber: { whatsAppAccountId: number; enabled: boolean }[];
  personaName: string;
  toneInstructions: string;
  /** 0–1 confidence below which the Agent hands off to a human. */
  handoffThreshold: number;
}

/** A business-knowledge file the Agent can draw on (FAQ / catalog / document). */
export interface AiKnowledgeFile {
  id: number;
  fileName: string;
  sizeBytes: number;
  uploadedAt: string;
}

/** A conversation currently handled by the AI Agent (monitoring view). */
export interface AiHandledConversation {
  conversationId: number;
  customerName: string;
  customerPhone: string;
  status: string;
  lastMessageAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class AiAgentApiService {
  private readonly api = inject(ApiClientService);
  private readonly http = inject(HttpClient);

  // ── Control panel (FE-4.1) ──────────────────────────────────────────────────

  /** TODO(US-4.6): confirm path — reads the tenant's AI Agent settings. */
  getSettings(): Observable<AiAgentSettings> {
    return this.api.get<AiAgentSettings>('/ai/agent-settings');
  }

  /** TODO(US-4.6): confirm path — persists the AI Agent settings; changes take effect immediately. */
  updateSettings(settings: AiAgentSettings): Observable<AiAgentSettings> {
    return this.api.put<AiAgentSettings>('/ai/agent-settings', settings);
  }

  /** TODO(US-4.6): confirm path — lists uploaded business-knowledge files. */
  getKnowledge(): Observable<AiKnowledgeFile[]> {
    return this.api.get<AiKnowledgeFile[]>('/ai/agent-knowledge');
  }

  /** TODO(US-4.6): confirm path — uploads a business-knowledge file (FAQ / catalog / document). */
  uploadKnowledge(file: File): Observable<AiKnowledgeFile> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<AiKnowledgeFile>(`${environment.apiUrl}/ai/agent-knowledge`, form);
  }

  /** TODO(US-4.6): confirm path — removes a business-knowledge file. */
  removeKnowledge(id: number): Observable<void> {
    return this.api.delete<void>(`/ai/agent-knowledge/${id}`);
  }

  /** TODO(US-4.6): confirm path — conversations the Agent is currently handling (monitoring). */
  getHandledConversations(): Observable<AiHandledConversation[]> {
    return this.api.get<AiHandledConversation[]>('/ai/agent-conversations');
  }

  /** TODO(US-4.6): confirm path — human takes over a conversation; stops the Agent on it. */
  takeOver(conversationId: number): Observable<void> {
    return this.api.post<void>(`/conversations/${conversationId}/ai/takeover`, {});
  }

  // ── Escalation recommendation (FE-4.2) ──────────────────────────────────────

  /** TODO(US-4.2/4.5): confirm path — current escalation recommendation for a conversation. */
  getEscalation(conversationId: number): Observable<EscalationRecommendation> {
    return this.api.get<EscalationRecommendation>(`/conversations/${conversationId}/escalation`);
  }

  /** TODO(US-4.2/4.5): confirm path — confirms the escalation (optionally to a chosen agent). */
  confirmEscalation(conversationId: number, targetUserId: number | null): Observable<void> {
    return this.api.post<void>(`/conversations/${conversationId}/escalation/confirm`, { targetUserId });
  }

  /** TODO(US-4.2/4.5): confirm path — dismisses/overrides the escalation recommendation. */
  overrideEscalation(conversationId: number): Observable<void> {
    return this.api.post<void>(`/conversations/${conversationId}/escalation/override`, {});
  }
}
