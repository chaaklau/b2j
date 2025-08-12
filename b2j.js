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
    '⠚': 'oey',   // ⠚ (dots-245)
    '⠎': 'oen',   // ⠎ (dots-234)
    '⠒': 'oeng',  // ⠒ (dots-25)
    '⠭': 'oet',   // ⠭ (dots-1346)
    '⠪': 'oek',   // ⠪ (dots-246)
    
    // y series (yu)
    '⠹': 'yu',    // ⠹ (dots-1456)
    '⠆': 'yun',   // ⠆ (dots-23)
    '⠷': 'yut',   // ⠷ (dots-12356)
  };

  const toneMap = {
    '⠁': '2', // high rising tone (dots-1)
    '⠈': '3', // mid level tone (dots-4) 
    '⠄': '4', // low falling tone (dots-3)
    '⠠': '5', // low rising tone (dots-6)
    '⠂': '6', // low level tone (dots-2)
    '⠐': '3', // high level checked tone (dots-5)
    // Note: Tone 1 is typically unmarked in Cantonese Braille
    // Note: There are two ⠄ entries in the source - using first occurrence for tone 4, second would be tone 9
  };

  const chars = [...brailleString]; // Use spread syntax to handle unicode characters properly
  let romanization = '';
  let i = 0;

  while (i < chars.length) {
    let initial = '';
    let final = '';
    let tone = '1';

    const char1 = chars[i];
    const char2 = chars[i + 1];
    const char3 = chars[i + 2];

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
    // If no pattern matches, skip the character to avoid an infinite loop
    else {
      console.warn(`Unrecognized Braille character or sequence starting with: ${char1}`);
      i++;
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