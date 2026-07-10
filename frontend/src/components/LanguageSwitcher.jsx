import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n/index.js';

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();
  return (
    <select
      value={i18n.language.split('-')[0]}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className={`rounded-full border border-leaf-200 bg-white px-3 py-1.5 text-xs font-medium text-leaf-800 focus:outline-none ${className}`}
      aria-label="Select language"
    >
      {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
    </select>
  );
}
