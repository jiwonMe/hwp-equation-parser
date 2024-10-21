import { Token, tokenize } from './tokenizer';

type ASTNode = {
  type: string;
  value?: string | number;
  children?: ASTNode[];
};

class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(input: string) {
    this.tokens = tokenize(input);
  }

  parse(): ASTNode {
    return this.equation();
  }

  private equation(): ASTNode {
    if (this.match('LEFT_BRACE')) {
      const eq = this.equation();
      this.consume('RIGHT_BRACE', "Expect '}' after equation");
      return { type: 'GROUP', children: [eq] };
    }

    if (this.check('FUNCTION')) {
      return this.function();
    }

    return this.term();
  }

  private term(): ASTNode {
    let left = this.factor();

    while (this.match('SPECIAL_STRUCTURE')) {
      const operator = this.previous().lexeme;
      const right = this.factor();
      left = { type: 'FRACTION', children: [left, right] };
    }

    return left;
  }

  private factor(): ASTNode {
    const node: ASTNode = { type: 'TERM', children: [] };

    while (!this.isAtEnd() && !this.check('RIGHT_BRACE') && !this.check('SPECIAL_STRUCTURE')) {
      if (this.match('NUMBER')) {
        node.children!.push({ type: 'NUMBER', value: parseFloat(this.previous().lexeme) });
      } else if (this.match('CHARACTER')) {
        node.children!.push({ type: 'CHARACTER', value: this.previous().lexeme });
      } else if (this.match('OPERATOR')) {
        node.children!.push({ type: 'OPERATOR', value: this.previous().lexeme });
      } else if (this.match('SPECIAL_SYMBOL')) {
        node.children!.push({ type: 'SPECIAL_SYMBOL', value: this.previous().lexeme });
      } else if (this.match('SPACE')) {
        node.children!.push({ type: 'SPACE', value: this.previous().lexeme });
      } else {
        break;
      }
    }

    return node.children!.length === 1 ? node.children![0] : node;
  }

  private function(): ASTNode {
    const func = this.consume('FUNCTION', 'Expect function name');
    const arg = this.equation();
    return { type: 'FUNCTION', value: func.lexeme, children: [arg] };
  }

  private match(...types: string[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: string): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private consume(type: string, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}

export function parse(input: string): ASTNode {
  const parser = new Parser(input);
  return parser.parse();
}