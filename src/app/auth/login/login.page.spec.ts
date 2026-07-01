import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DEVICE_LANGUAGE_PREFERENCES } from '../../core/i18n/i18n.service';
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
  let router: jasmine.SpyObj<Router>;

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
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    router.navigateByUrl.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: DEVICE_LANGUAGE_PREFERENCES, useValue: ['es-ES'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
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

  /**
   * Confirms guest mode enters the dashboard without an OAuth redirect.
   *
   * Decision: the skip button is a product entry point, not decorative copy,
   * because anonymous users receive a limited request quota.
   */
  it('continues to home when the user skips registration', async () => {
    await fixture.whenStable();

    const skipButton = fixture.nativeElement.querySelector('.skip-button');
    skipButton.click();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });
});
