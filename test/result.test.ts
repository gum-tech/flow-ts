import { Ok, Err, isOk, isErr, isSome } from '../src';

describe('Result', () => {
  describe('constructors', () => {
    it('isOk', () => {
      expect(isOk(Ok(10))).toEqual(true);
      expect(isOk(Err('message'))).toEqual(false);
    });
    it('isErr', () => {
      expect(isErr(Err('message'))).toEqual(true);
      expect(isErr(Ok(10))).toEqual(false);
    });
    it('ok', () => {
      expect(isSome(Ok(10).ok())).toEqual(true);
      expect(isSome(Err('message').ok())).toEqual(false);
    });
    it('err', () => {
      expect(isSome(Ok(10).err())).toEqual(false);
      expect(isSome(Err('message').err())).toEqual(true);
    });
    it('unwraps', () => {
      expect(Ok(true).unwrap()).toEqual(true);
      expect(Ok(0).unwrap()).toEqual(0);
      expect(Ok('value').unwrap()).toEqual('value');
      expect(Ok({ x: 1, y: 2 }).unwrap()).toEqual({ x: 1, y: 2 });
      expect(() => Err('message').unwrap()).toThrow(
        '`Result.unwrap()` on a `Err` value'
      );
    });
    it('unwrapOr', () => {
      expect(Ok(2).unwrapOr(4)).toEqual(2);
      expect(Err('message').unwrapOr('error')).toEqual('error');
    });
    it('unwrapOrElse', () => {
      expect(Ok(2).unwrapOrElse(() => 16)).toEqual(2);
      expect(Err('message').unwrapOrElse(() => 'error returned')).toEqual(
        'error returned'
      );
    });
    it('unwrapErr', () => {
      expect(() => Ok(2).unwrapErr()).toThrow(
        '`Result.unwrapErr()` on a `Ok` value'
      );
      expect(Err('message').unwrapErr()).toEqual('message');
    });

    it('expects', () => {
      expect(Ok(true).expect('Not true')).toEqual(true);
      expect(() => Err('message').expect('error')).toThrow('error');
    });

    it('expectErr', () => {
      expect(Err('message').expectErr('error')).toEqual('message');
      expect(() => Ok('message').expectErr('error')).toThrow(
        '`Result.expectErr()` on a `Ok` value'
      );
    });
  });
});
