import { TestBed } from '@angular/core/testing';
import { ConversationBadgesComponent } from './conversation-badges.component';
import type { ConversationClassificationBadgeData } from '../../models/conversation-classification.model';
import { LanguageService } from '../../../../core/services/language.service';
import { DOCUMENT } from '@angular/common';

function mockLanguageService(): LanguageService {
  const doc = typeof document !== 'undefined' ? document : null;
  const ls = new LanguageService(DOCUMENT as any);
  return ls;
}

describe('ConversationBadgesComponent', () => {
  async function setup(data: ConversationClassificationBadgeData | null) {
    await TestBed.configureTestingModule({
      imports: [ConversationBadgesComponent],
      providers: [
        { provide: DOCUMENT, useValue: document },
        LanguageService,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ConversationBadgesComponent);
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
    return { fixture };
  }

  it('PH-1.1: urgent priority renders danger badge', async () => {
    const { fixture } = await setup({
      conversationId: 1,
      priority: 'urgent',
    } as any);
    const el = fixture.nativeElement as HTMLElement;
    const badges = el.querySelectorAll('.badge');
    expect(badges.length).toBeGreaterThanOrEqual(1);
    const hasUrgent = Array.from(badges).some(b => b.classList.contains('badge--danger') && b.textContent?.trim().toLowerCase() === 'urgent');
    expect(hasUrgent).toBe(true);
  });

  it('PH-1.2: angry sentiment renders danger badge', async () => {
    const { fixture } = await setup({
      conversationId: 2,
      sentiment: 'angry',
    } as any);
    const el = fixture.nativeElement as HTMLElement;
    const badges = el.querySelectorAll('.badge');
    expect(badges.length).toBeGreaterThanOrEqual(1);
    const hasAngry = Array.from(badges).some(b => b.classList.contains('badge--danger') && b.textContent?.trim().toLowerCase() === 'angry');
    expect(hasAngry).toBe(true);
  });

  it('PH-1.3: negative sentiment renders warning badge', async () => {
    const { fixture } = await setup({
      conversationId: 3,
      sentiment: 'negative',
    } as any);
    const el = fixture.nativeElement as HTMLElement;
    const badges = el.querySelectorAll('.badge');
    expect(badges.length).toBeGreaterThanOrEqual(1);
    const hasNeg = Array.from(badges).some(b => b.classList.contains('badge--warning') && b.textContent?.trim().toLowerCase() === 'negative');
    expect(hasNeg).toBe(true);
  });

  it('PH-1.4: neutral/normal hidden', async () => {
    const { fixture } = await setup({
      conversationId: 4,
      sentiment: 'neutral',
      priority: 'normal',
    } as any);
    const el = fixture.nativeElement as HTMLElement;
    const badges = el.querySelectorAll('.badge');
    expect(badges.length).toBe(0);
  });

  it('PH-1.5: escalated conversation shows indicator', async () => {
    const { fixture } = await setup({
      conversationId: 5,
      escalate: true,
      sentiment: 'neutral',
      priority: 'normal',
    } as any);
    const el = fixture.nativeElement as HTMLElement;
    const badges = el.querySelectorAll('.badge--danger');
    expect(badges.length).toBeGreaterThanOrEqual(1);
    const hasEsc = Array.from(badges).some(b => b.textContent?.trim().toLowerCase() === 'escalated');
    expect(hasEsc).toBe(true);
  });

  it('PH-1.5: escalationStatus=open shows indicator', async () => {
    const { fixture } = await setup({
      conversationId: 6,
      escalationStatus: 'open',
    } as any);
    const el = fixture.nativeElement as HTMLElement;
    const badges = el.querySelectorAll('.badge--danger');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('PH-1.6: resolved escalation removes indicator', async () => {
    const { fixture } = await setup({
      conversationId: 7,
      escalationStatus: 'resolved',
    } as any);
    const el = fixture.nativeElement as HTMLElement;
    const badges = el.querySelectorAll('.badge');
    expect(badges.length).toBe(0);
  });

  it('PH-1.7: missing classification no crash', async () => {
    const { fixture } = await setup(null);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toBe('');
  });

  it('PH-1.8: mixed language reason no layout break', async () => {
    const { fixture } = await setup({
      conversationId: 8,
      sentiment: 'angry',
      priority: 'urgent',
      language: 'mixed',
      reason: 'عميل غاضب urgent issue',
    } as any);
    const el = fixture.nativeElement as HTMLElement;
    const badges = el.querySelectorAll('.badge');
    expect(badges.length).toBeGreaterThanOrEqual(2);
  });

  it('PH-1.9: no VIP badge rendered', async () => {
    const { fixture } = await setup({
      conversationId: 9,
    } as any);
    const el = fixture.nativeElement as HTMLElement;
    const text = el.textContent?.toLowerCase() ?? '';
    expect(text).not.toContain('vip');
    expect(text).not.toContain('tier');
  });
});
