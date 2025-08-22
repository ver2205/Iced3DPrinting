"use client";
import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LANGS = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
];

export default function LanguageSwitcher({ locale: localeProp }) {
  const router = useRouter();
  const pathname = usePathname() || "/en";
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = useMemo(() => {
    if (localeProp) return localeProp;
    const seg1 = pathname.split("/")[1];
    return seg1 === "nl" ? "nl" : "en"; // default en
  }, [localeProp, pathname]);

  const currentLang = LANGS.find(l => l.code === currentLocale) || LANGS[0];

  const buildUrlFor = (nextLocale) => {
    if (pathname === "/") return `/${nextLocale}`;

    const parts = pathname.split("/");
    parts[1] = nextLocale;
    const base = parts.join("/");

    const qs = searchParams?.toString();
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    return qs ? `${base}?${qs}${hash}` : `${base}${hash}`;
  };

  const changeLanguage = (code) => {
    setIsOpen(false);
    router.push(buildUrlFor(code));
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(o => !o)}
        className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors duration-200"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium hidden sm:block">
          {currentLang.code.toUpperCase()}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          {LANGS.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                currentLocale === lang.code ? "bg-gray-700 text-white" : "text-gray-300"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
