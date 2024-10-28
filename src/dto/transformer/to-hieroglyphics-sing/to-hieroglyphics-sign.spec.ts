import { toHieroglyphicsSign } from './to-hieroglyphics-sign';

describe('toHieroglyphicsSign', () => {
  it('should map gardiner values to their corresponding signs', () => {
    const input = ['A1', 'A2'];
    const expectedOutput = ['𓀀', '𓀁'];
    expect(toHieroglyphicsSign(input)).toEqual(expectedOutput);
  });

  it('should return the original value if no mapping is found', () => {
    const input = ['A1', 'unknown'];
    const expectedOutput = ['𓀀', 'unknown'];
    expect(toHieroglyphicsSign(input)).toEqual(expectedOutput);
  });

  it('should handle an empty array', () => {
    const input: string[] = [];
    const expectedOutput: string[] = [];
    expect(toHieroglyphicsSign(input)).toEqual(expectedOutput);
  });
});
