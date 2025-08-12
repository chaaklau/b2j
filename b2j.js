/**
 * Parses a Cantonese Braille string into Jyutping romanization.
 * @param {string} brailleString The input string of Braille characters.
 * @returns {string} The resulting Jyutping string.
 */
function parseCantoneseBraille(brailleString) {
  // Mapping of Braille cells to their corresponding sounds.
  // Based on the Hong Kong Government's "Scheme for the Chinese Phonetic Alphabet and Braille".

  const initialMap = {
    '⠏': 'b', '⠯': 'p', '⠍': 'm', '⠋': 'f',
    '⠞': 'd', '⠾': 't', '⠝': 'n', '⠇': 'l',
    '⠅': 'g', '⠗': 'k', '⠛': 'ng', '⠓': 'h',
    '⠟': 'gw','⠻': 'kw','⠺': 'w',
    '⠉': 'z', '⠭': 'c', '⠎': 's', '⠚': 'j'
  };

  const finalMap = {
    // aa series
    '⠃': 'aa',    // ⠃ (dots-12)
    '⠬': 'aai',   // ⠬ (dots-346) 
    '⠌': 'aau',   // ⠌ (dots-34)
    '⠜': 'aam',   // ⠜ (dots-345)
    '⠘': 'aan',   // ⠘ (dots-45)
    '⠉': 'aang',  // ⠉ (dots-14)
    '⠏': 'aap',   // ⠏ (dots-1234)
    '⠞': 'aat',   // ⠞ (dots-2345)
    '⠅': 'aak',   // ⠅ (dots-13)
    
    // a series (plain)
    '⠩': 'ai',    // ⠩ (dots-146)
    '⠡': 'au',    // ⠡ (dots-16)
    '⠸': 'am',    // ⠸ (dots-456)
    '⠫': 'an',    // ⠫ (dots-1246)
    '⠛': 'ang',   // ⠛ (dots-1245)
    '⠢': 'ap',    // ⠢ (dots-26)
    '⠔': 'at',    // ⠔ (dots-35)
    '⠨': 'ak',    // ⠨ (dots-46)
    
    // e series
    '⠑': 'e',     // ⠑ (dots-15)
    '⠓': 'ei',    // ⠓ (dots-125)
    '⠶': 'eng',   // ⠶ (dots-2356)
    '⠺': 'ek',    // ⠺ (dots-2456)
    
    // i series
    '⠙': 'sz',    // ⠙ (dots-145) - represents /ɿ/ sound
    '⠊': 'i',     // ⠊ (dots-24)
    '⠽': 'iu',    // ⠽ (dots-13456)
    '⠖': 'im',    // ⠖ (dots-235)
    '⠲': 'in',    // ⠲ (dots-256)
    '⠴': 'ing',   // ⠴ (dots-356)
    '⠯': 'ip',    // ⠯ (dots-12346)
    '⠾': 'it',    // ⠾ (dots-23456)
    '⠗': 'ik',    // ⠗ (dots-1235)
    
    // o series
    '⠕': 'o',     // ⠕ (dots-135)
    '⠣': 'oi',    // ⠣ (dots-126)
    '⠧': 'ou',    // ⠧ (dots-1236)
    '⠇': 'om',    // ⠇ (dots-123)
    '⠝': 'on',    // ⠝ (dots-1345)
    '⠰': 'ong',   // ⠰ (dots-56)
    '⠍': 'op',    // ⠍ (dots-134)
    '⠋': 'ot',    // ⠋ (dots-124)
    '⠻': 'ok',    // ⠻ (dots-12456)
    
    // u series
    '⠥': 'u',     // ⠥ (dots-136)
    '⠳': 'ui',    // ⠳ (dots-1256)
    '⠮': 'un',    // ⠮ (dots-2346)
    '⠦': 'ung',   // ⠦ (dots-236)
    '⠵': 'ut',    // ⠵ (dots-1356)
    '⠟': 'uk',    // ⠟ (dots-12345)
    
    // oe series
    '⠱': 'oe',    // ⠱ (dots-156)
    '⠚': 'eoi',   // ⠚ (dots-245)
    '⠎': 'eon',   // ⠎ (dots-234)
    '⠒': 'oeng',  // ⠒ (dots-25)
    '⠭': 'eot',   // ⠭ (dots-1346)
    '⠪': 'oek',   // ⠪ (dots-246)
    
    // y series (yu)
    '⠹': 'yu',    // ⠹ (dots-1456)
    '⠆': 'yun',   // ⠆ (dots-23)
    '⠷': 'yut',   // ⠷ (dots-12356)
  };

  const toneMap = {
    '⠀': '1', // high level, (empty)
    '⠁': '2', // high rising tone (dots-1)
    '⠈': '3', // mid level tone (dots-4) 
    '⠄': '4', // low falling tone (dots-3)
    '⠠': '5', // low rising tone (dots-6)
    '⠂': '6', // low level tone (dots-2)
    '⠐': '3', // high level checked tone (dots-5)
    // Note: Tone 1 is typically unmarked in Cantonese Braille
    // Note: There are two ⠄ entries in the source - using first occurrence for tone 4, second would be tone 9
  };

  const numberMap = {
    '⠁': '1', '⠃': '2', '⠉': '3', '⠙': '4', '⠑': '5',
    '⠋': '6', '⠛': '7', '⠓': '8', '⠊': '9', '⠚': '0', 
    '⠀': ' '
  };

  const punctuationMap = {
    // Single character punctuations
    '⠿': '。',     // period (dots-123456)
    '⠤': '，',     // comma (dots-36)
    '⠘': '、',     // enumeration comma (dots-45)
    '⠰⠆': '‧',   // middle dot (dots-56,23)
    
    // Multi-character punctuations with space patterns
    '⠦⠀': '？',    // question mark (dots-236, blank)
    '⠮⠀': '！',    // exclamation mark (dots-2346, blank)
    '⠒⠀': '：',    // colon (dots-25, blank)
    '⠢⠀': '；',    // semicolon (dots-26, blank)
    '⠤⠄': '-',    // hyphen (dots-36,3)
    '⠤⠤': '—',    // em dash (dots-36,36)
    '⠄⠄⠄': '⋯', // ellipsis (dots-3,3,3)
    
    // Brackets and quotes
    '⠶': '(',      // opening parenthesis (dots-2356)
    '⠶⠀': ')',    // closing parenthesis (dots-2356, blank)
    '⠠⠶': '[',    // opening square bracket (dots-6,2356)
    '⠶⠄⠀': ']', // closing square bracket (dots-2356,3, blank)
    '⠣': '《',     // opening double angle bracket (dots-126)
    '⠜⠀': '》',   // closing double angle bracket (dots-345, blank)
    '⠠⠣': '〈',   // opening single angle bracket (dots-6,126)
    '⠜⠄⠀': '〉', // closing single angle bracket (dots-345,3, blank)
    '⠦': '「',     // opening corner bracket (dots-236)
    '⠴⠀': '」',   // closing corner bracket (dots-356, blank)
    '⠠⠦': '『',   // opening double corner bracket (dots-6,236)
    '⠴⠄⠀': '』', // closing double corner bracket (dots-356,3, blank)
    '⠷': '「',     // alt opening corner bracket (dots-12356)
    '⠻⠀': '」',   // alt closing corner bracket (dots-12456, blank)
    '⠸': '**',   // emphasis start (dots-456)
    '⠵⠀': '**', // emphasis end (dots-1356, blank)
  };

  const chars = [...brailleString]; // Use spread syntax to handle unicode characters properly
  let romanization = '';
  let i = 0;
  let inNumberMode = false;

  while (i < chars.length) {
    let initial = '';
    let final = '';
    let tone = '1';

    const char1 = chars[i];
    const char2 = chars[i + 1];
    const char3 = chars[i + 2];

    // Handle number prefix ⠼
    if (char1 === '⠼') {
      inNumberMode = true;
      i++;
      continue;
    }
    // Handle numbers when in number mode
    if (inNumberMode && numberMap[char1]) {
      romanization += numberMap[char1];
      i++;
      
      // Check if next character is also a number or if we've reached end
      if (i >= chars.length || (!numberMap[chars[i]] && chars[i] !== '⠼')) {
        inNumberMode = false;
        // if (i < chars.length) {
        //   romanization += ' ';
        // }
      }
      continue;
    }

    // Reset number mode if we encounter non-number characters
    if (inNumberMode && !numberMap[char1] && char1 !== '⠼') {
      inNumberMode = false;
    }

    // Handle punctuation - check for multi-character patterns first
    const nextTwo = char1 + (char2 || '');
    const nextThree = char1 + (char2 || '') + (char3 || '');
    
    // Check for three-character punctuation patterns first
    if (nextThree === '⠄⠄⠄') {
      romanization += punctuationMap[nextThree];
      i += 3;
      if (i < chars.length) {
        romanization += ' ';
      }
      continue;
    }
    
    // Check for two-character punctuation patterns
    if (punctuationMap[nextTwo]) {
      romanization += punctuationMap[nextTwo];
      i += 2;
      if (i < chars.length) {
        romanization += ' ';
      }
      continue;
    }
    
    // Check for single-character punctuation
    if (punctuationMap[char1]) {
      romanization += punctuationMap[char1];
      i++;
      if (i < chars.length) {
        romanization += ' ';
      }
      continue;
    }

    // Check for compound tone markers first (dots-6 based)
    if (char1 === '⠠' && char2) {
      const compound = char1 + char2;
      if (toneMap[compound]) {
        // This is a compound tone marker, skip for now and handle in context
      }
    }

    // Check for a standard Initial + Final pattern
    if (initialMap[char1] && finalMap[char2]) {
      initial = initialMap[char1];
      final = finalMap[char2];
      i += 2;

      // Check for tone marks (single or compound)
      if (i < chars.length) {
        if (toneMap[chars[i]]) {
          tone = toneMap[chars[i]];
          i++;
        } else if (chars[i] === '⠠' && i + 1 < chars.length) {
          const compound = chars[i] + chars[i + 1];
          if (toneMap[compound]) {
            tone = toneMap[compound];
            i += 2;
          }
        }
      }
    } 
    // Handle syllables with no initial (e.g., vowel-only syllables)
    else if (finalMap[char1]) {
      final = finalMap[char1];
      i += 1;
      
      // Check for tone marks (single or compound)
      if (i < chars.length) {
        if (toneMap[chars[i]]) {
          tone = toneMap[chars[i]];
          i++;
        } else if (chars[i] === '⠠' && i + 1 < chars.length) {
          const compound = chars[i] + chars[i + 1];
          if (toneMap[compound]) {
            tone = toneMap[compound];
            i += 2;
          }
        }
      }
    }
    // Handle edge cases and ambiguous characters with context
    else if (initialMap[char1] && char2) {
      // Check if char2 can be a final
      if (finalMap[char2]) {
        initial = initialMap[char1];
        final = finalMap[char2];
        i += 2;
        if (i < chars.length) {
          if (toneMap[chars[i]]) {
            tone = toneMap[chars[i]];
            i++;
          } else if (chars[i] === '⠠' && i + 1 < chars.length) {
            const compound = chars[i] + chars[i + 1];
            if (toneMap[compound]) {
              tone = toneMap[compound];
              i += 2;
            }
          }
        }
      } else {
        // char1 might be used as final instead
        if (finalMap[char1]) {
          final = finalMap[char1];
          i += 1;
          if (i < chars.length) {
            if (toneMap[chars[i]]) {
              tone = toneMap[chars[i]];
              i++;
            } else if (chars[i] === '⠠' && i + 1 < chars.length) {
              const compound = chars[i] + chars[i + 1];
              if (toneMap[compound]) {
                tone = toneMap[compound];
                i += 2;
              }
            }
          }
        } else {
          console.warn(`Unrecognized pattern: ${char1}${char2 || ''}`);
          i++;
          continue;
        }
      }
    }
    // If no pattern matches, display illegal character as-is and skip to avoid infinite loop
    else {
      console.warn(`Unrecognized Braille character or sequence starting with: ${char1}`);
      romanization += char1;
      i++;
      if (i < chars.length) {
        romanization += ' ';
      }
      continue;
    }

    // Apply initial consonant rules for finals without initials
    if (initial === '') {
      // If final begins with 'y' or 'i' (but not 'ik' or 'ing'), add 'j'
      if ((final.startsWith('y') || final.startsWith('i')) && final !== 'ik' && final !== 'ing') {
        initial = 'j';
      }
      // If final is 'u', 'un', or 'ut', add 'w'
      else if (final === 'u' || final === 'un' || final === 'ut') {
        initial = 'w';
      }
    }

    romanization += `${initial}${final}${tone}`;
    
    // Add space between syllables for better readability
    if (i < chars.length) {
      romanization += ' ';
    }
  }
  
  // Convert p4, t4, k4 to p6, t6, k6 for proper Cantonese tone representation
  romanization = romanization.replace(/p4/g, 'p6')
                             .replace(/t4/g, 't6')
                             .replace(/k4/g, 'k6');
  
  return romanization.trim(); // Remove trailing space
}

// Export function for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseCantoneseBraille };
}