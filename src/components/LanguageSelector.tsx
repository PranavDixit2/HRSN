import { useTranslation } from 'react-i18next';
import { LANGUAGE_OPTIONS } from '../types/screening';

export function LanguageSelector() {
    const { i18n } = useTranslation();

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <select
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Select language"
            >
                {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
