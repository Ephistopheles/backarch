/**
 * Top Header / Toolbar component
 */

import { useAppStore } from "../../store/app.store";
import { STACKS, ARCHITECTURES } from "../../core/stacks";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { t } from "../../i18n";
import BackArchLogo from "../../assets/logo/backarch-logo.svg";
import type { Language } from "../../i18n";

export function Header() {
  const selectedStack = useAppStore((s) => s.selectedStack);
  const selectedVersion = useAppStore((s) => s.selectedVersion);
  const selectedArchitecture = useAppStore((s) => s.selectedArchitecture);
  const language = useAppStore((s) => s.language);
  const setStack = useAppStore((s) => s.setStack);
  const setVersion = useAppStore((s) => s.setVersion);
  const setArchitecture = useAppStore((s) => s.setArchitecture);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const currentStack = STACKS.find((s) => s.id === selectedStack);
  const versionOptions =
    currentStack?.versions.map((v) => ({ value: v, label: v })) || [];

  const toggleLanguage = () => {
    const newLang: Language = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <img
          src={BackArchLogo}
          alt="BackArch Logo"
          className="h-8 w-auto sm:h-10"
        />
      </div>

      {/* Center: Configuration selectors */}
      <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
        <Select
          label={t("header.stack")}
          options={STACKS.map((s) => ({ value: s.id, label: s.name }))}
          value={selectedStack}
          onChange={setStack}
        />

        <div className="w-px h-5 bg-slate-200" />

        <Select
          label={t("header.version")}
          options={versionOptions}
          value={selectedVersion}
          onChange={setVersion}
        />

        <div className="w-px h-5 bg-slate-200" />

        <Select
          label={t("header.architecture")}
          options={ARCHITECTURES.map((a) => ({ value: a.id, label: a.name }))}
          value={selectedArchitecture}
          onChange={setArchitecture}
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLanguage}
          className="
            px-3 py-1.5 text-sm font-medium
            bg-slate-100 hover:bg-slate-200
            text-slate-700 rounded
            transition-colors duration-150
          "
          aria-label="Toggle language"
        >
          {language.toUpperCase()}
        </button>
        <Button variant="primary" disabled>
          {t("header.generate")}
        </Button>
      </div>
    </header>
  );
}
