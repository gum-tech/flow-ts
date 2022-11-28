import { Ok, Err, isOk, isErr, isSome } from '../src';

describe('Result', () => {
  describe('combinators', () => {
    it('binds', () => {
      expect(
        Ok(2)
          .bind(x => Ok(x * 2))
          .unwrap()
      ).toEqual(4);
      expect(
        Err('message')
          .bind(e => Ok(e))
          .unwrapErr()
      ).toEqual('message');
    });
    it('maps', () => {
      expect(
        Ok(2)
          .map(x => x * 2)
          .map(x => x * x * x)
          .unwrap()
      ).toEqual(64);
      expect(
        Err('error')
          .map(e => `map reached ${e}`)
          .unwrapErr()
      ).toEqual('error');
    });

    it('mapErr', () => {
      expect(
        Ok('abcde')
          .mapErr(e => `map reached ${e}`)
          .unwrap()
      ).toEqual('abcde');
      expect(
        Err('error')
          .mapErr(e => `mapErr reached ${e}`)
          .mapErr(e => e.length)
          .unwrapErr()
      ).toEqual(20);
    });
    it('or', () => {
      expect(
        Ok('ok1')
          .or(Ok('ok2'))
          .unwrap()
      ).toEqual('ok1');
      expect(
        Ok('ok1')
          .or(Err('error1'))
          .unwrap()
      ).toEqual('ok1');
      expect(
        Err('error1')
          .or(Ok('ok1'))
          .unwrap()
      ).toEqual('ok1');
      expect(
        Err('error1')
          .or(Err('error2'))
          .unwrapErr()
      ).toEqual('error2');
    });
    it('and', () => {
      expect(
        Ok('ok1')
          .and(Ok('ok2'))
          .unwrap()
      ).toEqual('ok2');
      expect(
        Ok('ok1')
          .and(Err('error1'))
          .unwrapErr()
      ).toEqual('error1');
      expect(
        Err('error1')
          .and(Ok('ok1'))
          .unwrapErr()
      ).toEqual('error1');
      expect(
        Err('error1')
          .and(Err('error2'))
          .unwrapErr()
      ).toEqual('error1');
    });
    it('orElse', () => {
      expect(
        Ok('ok1')
          .orElse(() => Ok('ok2'))
          .unwrap()
      ).toEqual('ok1');
      expect(
        Ok('ok1')
          .orElse(() => Err('error2'))
          .unwrap()
      ).toEqual('ok1');
      expect(
        Err('error1')
          .orElse(() => Ok('ok2'))
          .unwrap()
      ).toEqual('ok2');
      expect(
        Err('error1')
          .orElse(() => Err('error2'))
          .unwrapErr()
      ).toEqual('error2');
    });
  });
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
