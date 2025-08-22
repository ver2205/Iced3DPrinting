// lib/getDictionaryClient.js  (CLIENT-SAFE)
export async function getDictionaryClient(locale) {
  switch (locale) {
    case 'nl':
      return (await import('./dictionaries/nl.json')).default;
    case 'en':
    default:
      return (await import('./dictionaries/en.json')).default;
  }
}
