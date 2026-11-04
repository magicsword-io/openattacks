// Adapted from Agent Atomics; Apache-2.0. See ../NOTICE.
const MAX_STRING_LENGTH = 8192, MAX_RECORD_BYTES = 262144, MAX_DEPTH = 16, MAX_KEYS = 4096, MAX_ARRAY_ITEMS = 256;
export class StrictJsonError extends Error { constructor(message) { super(message); this.name = 'StrictJsonError'; } }

export function parseStrictJson(text, { maxStringLength = MAX_STRING_LENGTH } = {}) {
  if (!Number.isInteger(maxStringLength) || maxStringLength < 1 || maxStringLength > 8192) throw new StrictJsonError('invalid-string-limit');
  if (typeof text !== 'string' || Buffer.byteLength(text) > MAX_RECORD_BYTES) throw new StrictJsonError('record-too-large');
  let index = 0; let keys = 0;
  const whitespace = () => { while (/[ \t\r\n]/.test(text[index] ?? '')) index += 1; };
  const string = () => {
    const start = index; if (text[index] !== '"') throw new StrictJsonError('expected-string'); index += 1;
    while (index < text.length) { const character = text[index++]; if (character === '"') break; if (character === '\\') { if (index >= text.length) throw new StrictJsonError('invalid-escape'); index += 1; } else if (character.charCodeAt(0) < 0x20) throw new StrictJsonError('invalid-control-character'); }
    const token = text.slice(start, index); let result;
    try { result = JSON.parse(token); } catch { throw new StrictJsonError('invalid-string'); }
    if (result.length > maxStringLength) throw new StrictJsonError('string-too-long');
    return result;
  };
  const value = (depth = 0) => {
    if (depth > MAX_DEPTH) throw new StrictJsonError('nesting-too-deep'); whitespace(); const character = text[index];
    if (character === '"') return string();
    if (character === '{') {
      index += 1; whitespace(); const object = Object.create(null); const seen = new Set(); if (text[index] === '}') { index += 1; return object; }
      while (true) { whitespace(); const key = string(); if (seen.has(key)) throw new StrictJsonError('duplicate-key'); if (key === '__proto__' || key === 'constructor' || key === 'prototype') throw new StrictJsonError('unsafe-key'); seen.add(key); keys += 1; if (keys > MAX_KEYS) throw new StrictJsonError('too-many-keys'); whitespace(); if (text[index++] !== ':') throw new StrictJsonError('expected-colon'); Object.defineProperty(object, key, { value: value(depth + 1), enumerable: true, writable: true, configurable: true }); whitespace(); if (text[index] === '}') { index += 1; return object; } if (text[index++] !== ',') throw new StrictJsonError('expected-comma'); }
    }
    if (character === '[') { index += 1; whitespace(); const array = []; if (text[index] === ']') { index += 1; return array; } while (true) { array.push(value(depth + 1)); if (array.length > MAX_ARRAY_ITEMS) throw new StrictJsonError('too-many-array-items'); whitespace(); if (text[index] === ']') { index += 1; return array; } if (text[index++] !== ',') throw new StrictJsonError('expected-comma'); } }
    for (const [literal, parsed] of [['true', true], ['false', false], ['null', null]]) if (text.startsWith(literal, index)) { index += literal.length; return parsed; }
    const match = text.slice(index).match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/); if (!match) throw new StrictJsonError('invalid-value'); index += match[0].length; const number = Number(match[0]); if (!Number.isFinite(number)) throw new StrictJsonError('non-finite-number'); return number;
  };
  const result = value(); whitespace(); if (index !== text.length) throw new StrictJsonError('trailing-data'); if (!result || Array.isArray(result) || typeof result !== 'object') throw new StrictJsonError('record-must-be-object'); return result;
}
