import moderationRegexes from './moderationRegexes.json';
import Filter from 'bad-words';

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
        const regex = entry.regex;
        return text.match(regex) !== null;
      })
      .filter((isRegexMatch: boolean) => isRegexMatch).length > 0
  );
};
