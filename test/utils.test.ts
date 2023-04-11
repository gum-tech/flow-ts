import { Option, Some, None, Result, Ok, Err, equals } from '../src';

describe('equals', () => {
  it('Options equality', () => {
    const someValue1: Option<number> = Some(42);
    const someValue2: Option<number> = Some(42);
    const someValue3: Option<number> = Some(50);
    const noneValue: Option<number> = None;

    expect(equals(someValue1, someValue2)).toBe(true);
    expect(equals(someValue1, someValue3)).toBe(false);
    expect(equals(someValue2, someValue3)).toBe(false);
    expect(equals(noneValue, None)).toBe(true);
  });

  it('Results equality', () => {
    const okValue1: Result<number, string> = Ok(42);
    const okValue2: Result<number, string> = Ok(42);
    const okValue3: Result<number, string> = Ok(50);
    const errValue1: Result<number, string> = Err('Error 1');
    const errValue2: Result<number, string> = Err('Error 1');
    const errValue3: Result<number, string> = Err('Error 2');

    expect(equals(okValue1, okValue2)).toBe(true);
    expect(equals(okValue1, okValue3)).toBe(false);
    expect(equals(okValue2, okValue3)).toBe(false);
    expect(equals(errValue1, errValue2)).toBe(true);
    expect(equals(errValue1, errValue3)).toBe(false);
    expect(equals(errValue2, errValue3)).toBe(false);
  });

  it('Mixed types inequality', () => {
    const someValue: Option<number> = Some(42);
    const noneValue: Option<number> = None;
    const okValue: Result<number, string> = Ok(42);
    const errValue: Result<number, string> = Err('Error 1');

    expect(equals(someValue, okValue)).toBe(false);
    expect(equals(noneValue, errValue)).toBe(false);
  });
});
