import 'server-only';

const dictionaries = {
  en: () =>
    import('./dictionaries/en.json', { assert: { type: 'json' } }).then(
      (m) => m.default
    ),
  nl: () =>
    import('./dictionaries/nl.json', { assert: { type: 'json' } }).then(
      (m) => m.default
    ),
};

export async function getDictionary(locale) {
  return await (dictionaries[locale] ?? dictionaries.en)();
}
