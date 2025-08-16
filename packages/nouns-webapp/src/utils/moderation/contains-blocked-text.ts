import Filter from 'bad-words';

import moderationRegexes from './moderation-regexes.json';

/**
 * Check if text matches a blocked phrase in a given language
 *
 * @param text
 * @param language
 * @returns boolean true iif text matches a blocked word of phrase
 */
export const containsBlockedText = (text: string, language: string) => {
  // Get modearation regexes for language
  const regexesForLanguage = new Map(Object.entries(moderationRegexes)).get(language);
  // Default to letting the string through if the language is unsupported
  if (regexesForLanguage === undefined) {
    console.log(`Unsupported language ${language} requested`);
    return false;
  }

  // Filter based on bad-words profanity filters
  const filter = new Filter();
  if (filter.isProfane(text)) {
    return true;
  }

  // Filter based on custom regexes
  return (
    regexesForLanguage
      .map((entry: { regex: string }) => {
        const regExp = new RegExp(entry.regex, 'i');
        return regExp.exec(text) !== null;
      })
      .filter((isRegexMatch: boolean) => isRegexMatch).length > 0
  );
};
