import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../core/auth/auth.service';
import { HomePage } from './home.page';

/**
 * Unit tests for the first authenticated home surface.
 *
 * Decision: AuthService is mocked so the component contract is tested without
 * creating a live Supabase client during Karma runs.
 */
describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: () => false,
            user: () => null,
            signOut: jasmine.createSpy('signOut').and.resolveTo(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  /**
   * Confirms the page can render with the mocked logged-out state.
   *
   * Decision: this keeps the starter test useful after replacing the blank Ionic
   * page with an auth-aware first screen.
   */
  it('should create', async () => {
    await fixture.whenStable();

    expect(component).toBeTruthy();
  });
});
