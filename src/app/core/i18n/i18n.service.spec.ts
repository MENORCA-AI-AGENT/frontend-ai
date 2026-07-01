import { TestBed } from '@angular/core/testing';
import {
  DEVICE_LANGUAGE_PREFERENCES,
  I18nService,
} from './i18n.service';

/**
 * Unit tests for runtime internationalization.
 *
 * Decision: device language preferences are injected so tests can validate iOS
 * and Android locale formats without mutating the real browser navigator.
 */
describe('I18nService', () => {
  function createService(preferences: readonly string[]): I18nService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: DEVICE_LANGUAGE_PREFERENCES, useValue: preferences },
      ],
    });

    return TestBed.inject(I18nService);
  }

  /**
   * Confirms regional English locales collapse to the supported base language.
   *
   * Decision: devices commonly report `en-US` or `en-GB`; the app should not
   * require exact region dictionaries for the first i18n milestone.
   */
  it('uses English for regional English device preferences', () => {
    const service = createService(['en-US', 'es-ES']);

    expect(service.language()).toBe('en');
    expect(service.t('auth.loginTitle')).toBe('Welcome back');
  });

  /**
   * Confirms Catalan device preferences are supported for Menorca users.
   *
   * Decision: Catalan is prioritized alongside Spanish and English because the
   * product is local to the Balearic Islands.
   */
  it('uses Catalan for Catalan device preferences', () => {
    const service = createService(['ca-ES']);

    expect(service.language()).toBe('ca');
    expect(service.t('home.nextBuses')).toBe('Pròxims busos');
  });

  /**
   * Confirms unsupported languages fall back to Spanish.
   *
   * Decision: Spanish is the default product language and safest fallback for
   * the current Menorca experience.
   */
  it('falls back to Spanish when the device language is unsupported', () => {
    const service = createService(['de-DE']);

    expect(service.language()).toBe('es');
    expect(service.t('auth.skipRegistration')).toBe('Omitir registro');
  });
});
