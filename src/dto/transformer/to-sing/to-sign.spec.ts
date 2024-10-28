import { toSign } from './to-sign';

describe('toSign', () => {
  it('should map gardiner values to their corresponding signs', () => {
    const input = ['A1', 'A2'];
    const expectedOutput = ['𓀀', '𓀁'];
    expect(toSign(input)).toEqual(expectedOutput);
  });

  it('should return the original value if no mapping is found', () => {
    const input = ['A1', 'unknown'];
    const expectedOutput = ['𓀀', 'unknown'];
    expect(toSign(input)).toEqual(expectedOutput);
  });

  it('should handle an empty array', () => {
    const input: string[] = [];
    const expectedOutput: string[] = [];
    expect(toSign(input)).toEqual(expectedOutput);
  });
});
