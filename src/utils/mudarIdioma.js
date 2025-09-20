import { useTranslation } from "react-i18next"

const { i18n } = useTranslation();

export const mudarIdioma = (lang) => {
    i18n.changeLanguage(lang);
}