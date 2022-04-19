import moderationRegexes from './moderationRegexes.json';

/**
 * Check if text matches a blocked phrase in a given langugae
 *
 * @param text
 * @param language
 * @returns boolean true iif text matches a blocked word of phrase
 */
export const containsBlockedText = (text: string, language: string) => {
  // Get modearation regexes for language
  const regexesForLanguage = new Map(Object.entries(moderationRegexes)).get(language);
  // Default to letting the string through if the language is unsupprted
  if (regexesForLanguage === undefined) {
    console.log(`Unsupported langugae ${language} requested`);
    return false;
  }

  // Filter if we match at least one regex
  return (
    regexesForLanguage
      .map((entry: any) => {
        const regex = entry.regex;
        return text.match(regex) !== null;
      })
      .filter((isRegexMatch: boolean) => isRegexMatch).length > 0
  );
};
