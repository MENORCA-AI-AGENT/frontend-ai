import {
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';
import {
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
} from './translations';
import { SupportedLanguage, TranslationKey } from './i18n.types';

export const DEVICE_LANGUAGE_PREFERENCES = new InjectionToken<readonly string[]>(
  'Device language preferences',
  {
    providedIn: 'root',
    factory: () => {
      if (typeof navigator === 'undefined') {
        return [DEFAULT_LANGUAGE];
      }

      return navigator.languages?.length
        ? navigator.languages
        : [navigator.language || DEFAULT_LANGUAGE];
    },
  },
);

/**
 * Runtime internationalization service for device-language driven copy.
 *
 * Decision: Angular built-in i18n is compile-time oriented, while this mobile
 * app needs one native bundle that adapts to the device language at runtime.
 * A small signal-based service keeps that behavior explicit and dependency
 * free for the first supported screens.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly languagePreferences = inject(DEVICE_LANGUAGE_PREFERENCES);
  private readonly languageSignal = signal<SupportedLanguage>(
    this.resolveLanguage(this.languagePreferences),
  );

  readonly language = this.languageSignal.asReadonly();
  readonly dictionary = computed(() => TRANSLATIONS[this.language()]);

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      this.document.documentElement.lang = this.language();
    });
  }

  /**
   * Returns the localized text for a known translation key.
   *
   * Decision: missing keys are impossible at compile time because templates use
   * the `TranslationKey` union; the fallback still protects runtime tests and
   * future migrations.
   */
  t(key: TranslationKey): string {
    return this.dictionary()[key] ?? TRANSLATIONS[DEFAULT_LANGUAGE][key] ?? key;
  }

  /**
   * Overrides the active language for tests or future in-app language controls.
   *
   * Decision: device language remains the default, but a setter keeps the
   * service extensible without changing current templates later.
   */
  setLanguage(language: SupportedLanguage): void {
    this.languageSignal.set(language);
  }

  /**
   * Resolves the first supported language from device preferences.
   *
   * Decision: region subtags such as `en-US`, `es-ES`, or `ca-ES` collapse to
   * their base language so iOS and Android locale formats behave consistently.
   */
  private resolveLanguage(preferences: readonly string[]): SupportedLanguage {
    for (const preference of preferences) {
      const normalized = preference.toLowerCase().split('-')[0];

      if (this.isSupportedLanguage(normalized)) {
        return normalized;
      }
    }

    return DEFAULT_LANGUAGE;
  }

  private isSupportedLanguage(language: string): language is SupportedLanguage {
    return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
  }
}
