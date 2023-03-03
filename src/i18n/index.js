import en from './locales/en.json';
import { createI18n} from 'vue-i18n'

export const defaultLocale = 'en';
export const languages = {
    en: en
}

const translations = Object.assign(languages);

var currentLocale = 'en';

const i18n = createI18n({
    locale: currentLocale,
    fallbackLocale: defaultLocale,
    translations
});

export default i18n;