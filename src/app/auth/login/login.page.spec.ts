import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../core/auth/auth.service';
import { LoginPage } from './login.page';

/**
 * Unit tests for the branded OAuth login page.
 *
 * Decision: the auth service is mocked so the test verifies UI contract,
 * provider branding, and interactions without opening real OAuth windows.
 */
describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['signInWithProvider'],
      {
        loading: signal(false).asReadonly(),
        error: signal<string | null>(null).asReadonly(),
      },
    );
    authService.signInWithProvider.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
  });

  /**
   * Confirms both approved providers are rendered with branded SVGs.
   *
   * Decision: Google and Apple logos are part of the approval-sensitive login
   * contract and should not disappear during UI refactors.
   */
  it('renders Google and Apple login buttons with logos', async () => {
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(element.querySelectorAll('ion-button')).map((button) =>
      button.textContent?.trim().replace(/\s+/g, ' '),
    );

    expect(buttons).toContain('Continuar con Google');
    expect(buttons).toContain('Continuar con Apple');
    expect(element.querySelectorAll('.provider-logo svg').length).toBe(2);
  });

  /**
   * Confirms clicking Google delegates to the auth service.
   *
   * Decision: the component should not know Supabase redirect details; it only
   * sends the selected provider to the service.
   */
  it('starts Google sign-in from the Google button', async () => {
    await fixture.whenStable();

    const googleButton = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('ion-button'),
    ).find((button) =>
      button.textContent?.includes('Continuar con Google'),
    );
    googleButton?.click();

    expect(authService.signInWithProvider).toHaveBeenCalledWith('google');
  });
});
