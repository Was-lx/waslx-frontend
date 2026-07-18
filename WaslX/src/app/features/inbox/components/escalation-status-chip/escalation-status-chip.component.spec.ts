import { TestBed } from '@angular/core/testing';
import { EscalationStatusChipComponent } from './escalation-status-chip.component';
import { LanguageService } from '../../../../core/services/language.service';
import { DOCUMENT } from '@angular/common';

describe('EscalationStatusChipComponent', () => {
  async function setup(status: string | undefined | null, escalate?: boolean) {
    await TestBed.configureTestingModule({
      imports: [EscalationStatusChipComponent],
      providers: [
        { provide: DOCUMENT, useValue: document },
        LanguageService,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(EscalationStatusChipComponent);
    fixture.componentRef.setInput('status', status);
    if (escalate !== undefined) {
      fixture.componentRef.setInput('escalate', escalate);
    }
    fixture.detectChanges();
    return { fixture };
  }

  it('shows nothing when status is none and escalate is false', async () => {
    const { fixture } = await setup('none', false);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe('');
  });

  it('shows Escalated when escalate=true', async () => {
    const { fixture } = await setup(undefined, true);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.toLowerCase()).toContain('escalated');
  });

  it('shows Escalated when status=open', async () => {
    const { fixture } = await setup('open');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.toLowerCase()).toContain('escalated');
  });

  it('shows Pending when status=recommended', async () => {
    const { fixture } = await setup('recommended');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.toLowerCase()).toContain('pending');
  });

  it('shows Assigned when status=assigned', async () => {
    const { fixture } = await setup('assigned');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.toLowerCase()).toContain('assigned');
  });

  it('hides when status=resolved', async () => {
    const { fixture } = await setup('resolved');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe('');
  });

  it('hides when status=none and escalate not set', async () => {
    const { fixture } = await setup('none');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe('');
  });
});
