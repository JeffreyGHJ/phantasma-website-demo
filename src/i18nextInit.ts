import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const availableLanguages = ['en', 'zh', 'zh-TW'];

i18n.use(Backend) // load translations using http (default public/assets/locals/en/translations)
	.use(LanguageDetector) // detect user language
	.use(initReactI18next) // pass the i18n instance to react-i18next.
	.init({
		// resources,
		fallbackLng: {
			'zh-CN': ['zh'],
			default: ['en'],
		},

		debug: false,

		lng: localStorage.getItem('i18nextLng') || 'en',

		supportedLngs: availableLanguages,
		react: {
			useSuspense: false,
		},
		interpolation: {
			escapeValue: false, // no need for react. it escapes by default
		},
	});

export default i18n;
