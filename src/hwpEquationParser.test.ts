import { parse } from './hwpEquationParser';

describe('HWP Equation Parser', () => {
  test('Parse simple equation', () => {
    const input = 'a + b';
    const ast = parse(input);
    expect(ast).toEqual({
      type: 'TERM',
      children: [
        { type: 'CHARACTER', value: 'a' },
        { type: 'OPERATOR', value: '+' },
        { type: 'CHARACTER', value: 'b' },
      ],
    });
  });

  test('Parse equation with parentheses', () => {
    const input = '{a + b}';
    const ast = parse(input);
    expect(ast).toEqual({
      type: 'GROUP',
      children: [
        {
          type: 'TERM',
          children: [
            { type: 'CHARACTER', value: 'a' },
            { type: 'OPERATOR', value: '+' },
            { type: 'CHARACTER', value: 'b' },
          ],
        },
      ],
    });
  });

  test('Parse equation with function', () => {
    const input = 'SQRT{x + y}';
    const ast = parse(input);
    expect(ast).toEqual({
      type: 'FUNCTION',
      value: 'SQRT',
      children: [
        {
          type: 'GROUP',
          children: [
            {
              type: 'TERM',
              children: [
                { type: 'CHARACTER', value: 'x' },
                { type: 'OPERATOR', value: '+' },
                { type: 'CHARACTER', value: 'y' },
              ],
            },
          ],
        },
      ],
    });
  });

  test('Parse equation with fraction', () => {
    const input = 'a OVER b';
    const ast = parse(input);
    expect(ast).toEqual({
      type: 'FRACTION',
      children: [
        { type: 'CHARACTER', value: 'a' },
        { type: 'CHARACTER', value: 'b' },
      ],
    });
  });
});