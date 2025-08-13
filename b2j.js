/**
 * Parses a Cantonese Braille string into Jyutping romanization.
 * @param {string} brailleString The input string of Braille characters.
 * @returns {string} The resulting Jyutping string.
 */

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
  // Punctuations
  '⠿': '。',     // period without blank (non-standard but unambiguous)
  '⠿⠀': '。',     // period (dots-123456, blank)
  '⠤': '，',     // comma (dots-36)
  '⠘': '、',     // enumeration comma (dots-45)
  '⠰⠆': '‧',     // middle dot (dots-56,23)
  '⠦⠀': '？',    // question mark (dots-236, blank)
  '⠮⠀': '！',    // exclamation mark (dots-2346, blank)
  '⠒⠀': '：',    // colon (dots-25, blank)
  '⠢⠀': '；',    // semicolon (dots-26, blank)
  '⠤⠄': '-',    // hyphen (dots-36,3)
  '⠤⠤': '—',    // em dash (dots-36,36)
  '⠄⠄⠄': '…',   // ellipsis without blank (non-standard but unambiguous)
  '⠀⠄⠄⠄⠀': '…', // ellipsis (blank, dots-3,3,3, blank)
  
  // Brackets and quotes
  '⠀⠶': '（',      // opening parenthesis (blank, dots-2356)
  '⠶⠀': '）',    // closing parenthesis (dots-2356, blank)
  '⠀⠠⠶': '［',    // opening square bracket (blank, dots-6,2356)
  '⠶⠄⠀': '］', // closing square bracket (dots-2356,3, blank)
  '⠀⠣': '《',     // opening double angle bracket (blank, dots-126)
  '⠜⠀': '》',   // closing double angle bracket (dots-345, blank)
  '⠀⠠⠣': '〈',   // opening single angle bracket (blank, dots-6,126)
  '⠜⠄⠀': '〉', // closing single angle bracket (dots-345,3, blank)
  '⠀⠦': '「',     // opening corner bracket (blank, dots-236)
  '⠴⠀': '」',   // closing corner bracket (dots-356, blank)
  '⠀⠠⠦': '『',   // opening double corner bracket (blank, dots-6,236)
  '⠴⠄⠀': '』', // closing double corner bracket (dots-356,3, blank)
  '⠀⠷': '「',     // alt opening corner bracket (blank, dots-12356)
  '⠻⠀': '」',   // alt closing corner bracket (dots-12456, blank)
  '⠀⠸': '**',   // emphasis start (blank, dots-456)
  '⠵⠀': '**', // emphasis end (dots-1356, blank)
};

// Create reverse mappings from the original maps
const reverseInitialMap = {};
const reverseFinalMap = {};
const reverseToneMap = {};
const reverseNumberMap = {};
const reversePunctuationMap = {};

// Build reverse mappings
Object.entries(initialMap).forEach(([braille, sound]) => {
  reverseInitialMap[sound] = braille;
});

Object.entries(finalMap).forEach(([braille, sound]) => {
  reverseFinalMap[sound] = braille;
});

Object.entries(toneMap).forEach(([braille, tone]) => {
  reverseToneMap[tone] = braille;
});

Object.entries(numberMap).forEach(([braille, num]) => {
  reverseNumberMap[num] = braille;
});

Object.entries(punctuationMap).forEach(([braille, punct]) => {
  reversePunctuationMap[punct] = braille;
});

function parseCantoneseBraille(brailleString) {
  const chars = Array.from(brailleString.toUpperCase(), ch => {
    const order = ` A1B'K2L@CIF/MSP"E3H9O6R^DJG>NTQ,*5<-U8V.%[$+X!&;:4\\0Z7(_?W]#Y)=`.indexOf(ch);
    return order !== -1 ? String.fromCodePoint(0x2800 + order) : ch;
  });
  
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
    const nextFive = chars.slice(i, i + 5).join('');
    
    // Check for five-character punctuation patterns first
    if (punctuationMap[nextFive]) {
      romanization += punctuationMap[nextFive];
      i += 5;
      if (i < chars.length) {
        romanization += ' ';
      }
      continue;
    }
    
    // Check for three-character punctuation patterns
    if (punctuationMap[nextThree]) {
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
          romanization += char1;
          i++;
          if (i < chars.length) {
            romanization += ' ';
          }
          continue;
        }
      }
    }
    // Replace blank braille characters with normal spaces
    else if (char1 === '⠀') {
      romanization += ' ';
      i++;
      continue;
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
      // If final begins with 'u' (but now 'uk' or 'ung'), add 'w'
      else if (final.startsWith('u') && final !== 'uk' && final !== 'ung') {
        initial = 'w';
      }
      if (final === 'ang' && (tone === '4' || tone === '5' || tone === '6' )) {
        final = 'ng';
      }
      if (final === 'op') {
        final = 'm';
      }
    }

    romanization += `${initial}${final}${tone}`;
    
    // Add space between syllables for better readability
    if (i < chars.length) {
      romanization += ' ';
    }
  }
  
  // Apply romanization to Jyutping conversion rules
  romanization = rom2jp(romanization);
  
  // Trim for each line
  return romanization.replace(/^\s*(.*)\s*$/gm, '$1');
}

// Convert romanization to proper Jyutping format
function rom2jp(romanization) {
  return romanization.replace(/p4/g, 'p6')
                     .replace(/t4/g, 't6')
                     .replace(/k4/g, 'k6');
}

// Convert Jyutping back to romanization format (reverse of rom2jp)
function jp2rom(jyutping) {
  let result = jyutping.replace(/p6/g, 'p4')
                       .replace(/t6/g, 't4')
                       .replace(/k6/g, 'k4');
  
  // Remove j before y or i (except ik and ing)
  result = result.replace(/j(y|i(?!k|ng))/g, '$1');
  
  // Remove w before u (except uk and ung)
  result = result.replace(/w(u(?!k|ng))/g, '$1');
  
  result = result.replace(/(?<![a-z])ng(?=\d)/g, 'ang');
  result = result.replace(/(?<![a-z])m(?=\d)/g, 'op');

  return result.trim();
}

// Convert Jyutping to Cantonese Braille
function parseJyutpingToBraille(jyutpingString) {
  // Split into tokens (syllables, punctuation, spaces)
  const tokens = jyutpingString.match(/([a-z]*\d|\S|\s+)/gi);
  let brailleResult = '';
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Handle numbers
    if (/^\d+$/.test(token)) {
      brailleResult += '⠼'; // number prefix
      for (let digit of token) {
        brailleResult += reverseNumberMap[digit] || digit;
      }
    //   if (i < tokens.length - 1) brailleResult += ' ';
      continue;
    }
    
    // Handle punctuation
    if (reversePunctuationMap[token]) {
      brailleResult += reversePunctuationMap[token];
    //   if (i < tokens.length - 1) brailleResult += ' ';
      continue;
    }
    
    // Handle syllables - parse initial, final, tone
    const syllableMatch = jp2rom(token.toLowerCase()).match(/^([bcdfghjklmnpqrstvwxyz]*?)([aeiouy][a-z]*)(\d)$/);
    if (syllableMatch) {
      const [, initial, final, tone] = syllableMatch;
      
      // If syllable is recognized
      if ((!initial || reverseInitialMap[initial]) && reverseFinalMap[final] && reverseToneMap[tone]) {
        // Add initial if present
        if (initial) {
          brailleResult += reverseInitialMap[initial];
        }
        
        // Add final
        brailleResult += reverseFinalMap[final];
        
        // reverseToneMap[3] returns checked tone 3, so non-checked tone 3 is specially handled
        if (tone === '3' && !/[ptk]$/.test(final)) {
          brailleResult += '⠈';
        }
        // Add tone if not tone 1 or in case of monograph
        else if (tone !== '1' || !initial) {
          brailleResult += reverseToneMap[tone];
        }
        
      //   if (i < tokens.length - 1) brailleResult += ' ';
        continue;
      }

    }
    
    // If token is not recognized, add as-is
    brailleResult += token;
  //   if (i < tokens.length - 1) brailleResult += ' ';
  }
  
  // Trim and remove spaces between braille for each line
  return brailleResult.replace(/^\s*(.*)\s*$/gm, (_, line) => line.replace(/(?<=[⠀-⠿])\s+(?=[⠀-⠿])/g, ''));
}

// Export functions for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    parseCantoneseBraille, 
    parseJyutpingToBraille, 
    rom2jp, 
    jp2rom 
  };
}
