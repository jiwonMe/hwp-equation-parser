export type Token = {
  type: string;
  lexeme: string;
};

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;

  while (current < input.length) {
    let char = input[current];

    if (/\s/.test(char)) {
      current++;
      continue;
    }

    if (/[0-9]/.test(char)) {
      let value = '';
      while (current < input.length && /[0-9.]/.test(input[current])) {
        value += input[current];
        current++;
      }
      tokens.push({ type: 'NUMBER', lexeme: value });
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let value = '';
      while (current < input.length && /[a-zA-Z]/.test(input[current])) {
        value += input[current];
        current++;
      }
      if (['TIMES', 'OVER', 'ATOP', 'SUP', 'SUB', 'DIV', 'DIVIDE'].includes(value)) {
        tokens.push({ type: 'SPECIAL_STRUCTURE', lexeme: value });
      } else if (['SQRT', 'ABS', 'BIGG', 'MAX', 'MIN', 'sin', 'cos', 'tan', 'log', 'ln', 'exp'].includes(value)) {
        tokens.push({ type: 'FUNCTION', lexeme: value });
      } else if (['CASES', 'HAT', 'CHECK', 'TILDE', 'ACUTE', 'GRAVE', 'DOT', 'DDOT', 'BAR', 'VEC', 'DYAD', 'UNDER'].includes(value)) {
        tokens.push({ type: 'SPECIAL_STRUCTURE', lexeme: value });
      } else {
        tokens.push({ type: 'CHARACTER', lexeme: value });
      }
      continue;
    }

    if (['+', '-', '*', '^', '_'].includes(char)) {
      tokens.push({ type: 'OPERATOR', lexeme: char });
      current++;
      continue;
    }

    if (char === '{') {
      tokens.push({ type: 'LEFT_BRACE', lexeme: '{' });
      current++;
      continue;
    }

    if (char === '}') {
      tokens.push({ type: 'RIGHT_BRACE', lexeme: '}' });
      current++;
      continue;
    }

    if (['~', '`'].includes(char)) {
      tokens.push({ type: 'SPACE', lexeme: char });
      current++;
      continue;
    }

    // Handle other special symbols and structures here...

    current++;
  }

  tokens.push({ type: 'EOF', lexeme: '' });
  return tokens;
}