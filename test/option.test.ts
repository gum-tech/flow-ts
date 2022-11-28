import { Some, None, isNone, isSome, Option, flatten } from '../src';

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
    it('binds', () => {
      expect(
        Some(2)
          .bind(optCube)
          .bind(optDouble)
          .unwrap()
      ).toEqual(64);
      expect(isNone(None.bind(optCube).bind(optDouble))).toEqual(true);
    });
    it('binds and switch tracks', () => {
      expect(
        isNone(
          Some(2)
            .bind(x => optDivide(x, 0))
            .bind(optCube)
        )
      ).toEqual(true);
      expect(
        isSome(
          Some(2)
            .bind(x => optDivide(x, 1))
            .bind(optCube)
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
    it('gets or', () => {
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
    it('gets and', () => {
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

    it('flattens', () => {
      expect(
        flatten(Some(Some(Some(Some(Some(Some(Some(10)))))))).unwrap()
      ).toEqual(10);
      expect(isNone(flatten(Some(Some(None))))).toEqual(true);
      expect(flatten(Some('some1')).unwrap()).toEqual('some1');
      expect(flatten('string').unwrap()).toEqual('string');
      expect(isNone(flatten(None))).toEqual(true);
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
  });
});
