import { Some, None, isNone, isSome, Option, flatten, match } from '../src';

const optCube = (x: number): Option<number> => Some(x * x * x);
const optDouble = (x: number): Option<number> => Some(x * x);
const optDivide = (x: number, y: number): Option<number> =>
  y > 0 ? Some(x / y) : None;

const cube = (x: number): number => x * x * x;
const double = (x: number): number => x * x;
const divide = (x: number, y: number): number | undefined =>
  y > 0 ? x / y : undefined;
const isEven = (x: number): boolean => x % 2 === 0;
describe('Option', () => {
  describe('combinators', () => {
    it('andThens', () => {
      expect(
        Some(2)
          .andThen(optCube)
          .andThen(optDouble)
          .unwrap()
      ).toEqual(64);
      expect(isNone(None.andThen(optCube).andThen(optDouble))).toEqual(true);
    });
    it('andThens and switch tracks', () => {
      expect(
        isNone(
          Some(2)
            .andThen(x => optDivide(x, 0))
            .andThen(optCube)
        )
      ).toEqual(true);
      expect(
        isSome(
          Some(2)
            .andThen(x => optDivide(x, 1))
            .andThen(optCube)
        )
      ).toEqual(true);
    });
    it('maps', () => {
      expect(
        Some(2)
          .map(double)
          .map(cube)
          .unwrap()
      ).toEqual(64);
      expect(isNone(None.map(double).map(cube))).toEqual(true);
    });
    it('maps and switch tracks', () => {
      expect(isNone(Some(2).map(x => divide(x, 0)))).toEqual(true);
      expect(isNone(Some(2).map(x => divide(x, 0)))).toEqual(true);
    });
    it('or', () => {
      expect(
        Some('Some1')
          .or(Some('Some2'))
          .unwrap()
      ).toEqual('Some1');
      expect(
        Some('Some1')
          .or(None)
          .unwrap()
      ).toEqual('Some1');
      expect(None.or(Some('Some1')).unwrap()).toEqual('Some1');
      expect(isNone(None.or(None))).toEqual(true);
    });
    it('and', () => {
      expect(
        Some('Some1')
          .and(Some('Some2'))
          .unwrap()
      ).toEqual('Some2');
      expect(isNone(Some('Some1').and(None))).toEqual(true);
      expect(isNone(None.and(Some('Some1')))).toEqual(true);
      expect(isNone(None.and(None))).toEqual(true);
    });

    it('filters', () => {
      expect(isNone(Some(3).filter(isEven))).toEqual(true);
      expect(
        Some(6)
          .filter(isEven)
          .unwrap()
      ).toEqual(6);
      expect(isNone(None.filter(isEven))).toEqual(true);
    });
    it('orElse', () => {
      expect(
        Some('some1')
          .orElse(() => Some('some2'))
          .unwrap()
      ).toEqual('some1');
      expect(
        Some('some1')
          .orElse(() => None)
          .unwrap()
      ).toEqual('some1');
      expect(None.orElse(() => Some('some2')).unwrap()).toEqual('some2');
      expect(isNone(None.orElse(() => None))).toEqual(true);
    });

    it('match', () => {
      expect(
        match(Some(1),{
          Some: a => a,
          None: () => "It's a none",
        })
      ).toEqual(1);
      expect(
        match(None, {
          Some: a => a,
          None: () => "It's a none",
        })
      ).toEqual("It's a none");
    });
  });

  describe('contructors', () => {
    it('unwraps', () => {
      expect(Some(true).unwrap()).toEqual(true);
      expect(Some(0).unwrap()).toEqual(0);
      expect(Some('some1').unwrap()).toEqual('some1');
      expect(Some({ x: 1, y: 2 }).unwrap()).toEqual({ x: 1, y: 2 });
      expect(() => None.unwrap()).toThrow(
        '`Option.unwrap()` on a `None` value'
      );
    });

    it('unwrapOr', () => {
      expect(Some(true).unwrapOr(false)).toEqual(true);
      expect(Some(10).unwrapOr(100)).toEqual(10);
      expect(Some('Bike').unwrapOr('Car')).toEqual('Bike');
      expect(None.unwrapOr('Car')).toEqual('Car');
      expect(None.unwrapOr({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
    });

    it('unwrapOrElse', () => {
      expect(Some(2).unwrapOrElse(() => 16)).toEqual(2);
      expect(None.unwrapOrElse(() => 'error returned')).toEqual(
        'error returned'
      );
    });

    it('flattens', () => {
      expect(
        flatten(Some(Some(Some(Some(Some(Some(Some(10)))))))).unwrap()
      ).toEqual(10);
      expect(flatten(Some(Some(None)))).toEqual(None);
      expect(flatten(Some('some1')).unwrap()).toEqual('some1');
      expect(flatten(None)).toEqual(None);
    });

    it('expects', () => {
      expect(Some(true).expect('Not true')).toEqual(true);
      expect(() => None.expect('empty value returned')).toThrow(
        'empty value returned'
      );
    });

    it('isSome', () => {
      expect(isSome(Some(1))).toEqual(true);
      expect(isSome(None)).toEqual(false);
    });

    it('isNone', () => {
      expect(isNone(Some(1))).toEqual(false);
      expect(isNone(None)).toEqual(true);
    });
    it('okOr', () => {
      expect(
        Some('abcde')
          .okOr('Error message')
          .unwrap()
      ).toEqual('abcde');
      expect(None.okOr('Error message').unwrapErr()).toEqual('Error message');
    });
  });
});
