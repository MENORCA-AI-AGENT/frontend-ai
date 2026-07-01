import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { AuthCallbackPage } from './auth-callback.page';

/**
 * Unit tests for the OAuth callback page.
 *
 * Decision: callback exchange is mocked so routing behavior is verified without
 * requiring a live Supabase authorization code.
 */
describe('AuthCallbackPage', () => {
  let fixture: ComponentFixture<AuthCallbackPage>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'completeOAuthCallback',
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    authService.completeOAuthCallback.and.resolveTo(true);
    router.navigateByUrl.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [AuthCallbackPage],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallbackPage);
  });

  /**
   * Confirms successful callbacks route to home.
   *
   * Decision: login completion should land on the app surface, while the service
   * remains responsible for parsing and exchanging the callback code.
   */
  it('completes the callback and navigates home', async () => {
    fixture.componentInstance.ngOnInit();
    await fixture.whenStable();

    expect(authService.completeOAuthCallback).toHaveBeenCalledWith(
      window.location.href,
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home', {
      replaceUrl: true,
    });
  });
});
