import {Option, None, Some} from '../option/index';
import { Result, Err } from '../result/index';

interface Match<T, E, A, B> {
  Some?: (_: T) => A;
  None?: () => B;
  Ok?: (_: T) => A;
  Err?: (_: E) => B;
}

type Flatten<A, T extends Option<A> | Result<A, A>> =
  T extends { _tag: 'Some' } | { _tag: 'None' }
    ? Exclude<T, Result<A, A>>
  : T extends { _tag: 'Ok' } | { _tag: 'Err' }
    ? Exclude<T, Option<A>>
  : never

// recursively flattens a nested functors or monads into a single type
// @examples
// flatten f a -> f b
// flatten f f a -> f b
// flatten f f f a -> f b
// (fail) flatten f m f a -> f b
export const flatten = <T, F extends Option<T> | Result<T, T>>(
  t: F
  ): Flatten<T, F> => {
  switch (t._tag) {
    case 'None':
      return None;
    case 'Some':
      return ((t.unwrap() as unknown) as Option<T>).hasOwnProperty('_tag')
        ? flatten((t.unwrap() as unknown) as Option<T>)
        : t;
    case 'Ok':
      return ((t.unwrap() as unknown) as Result<T, T>).hasOwnProperty('_tag')
        ? flatten((t.unwrap() as unknown) as Result<T, T>)
        : t;
    case 'Err':
      return Err(t?.value);
    default:
      return t;
  }
};

export const match = <T, E, A, B>(t: Option<T> | Result<T, E>) => ({
  Some: onSome,
  None: onNone,
  Ok: onOk,
  Err: onErr,
}: Match<T, E, A, B>): A | B | string => {
  switch (t._tag) {
    case 'None':
      return onNone?.() ?? 'No match defined for None';
    case 'Some':
      return onSome?.(t.unwrap()) ?? 'No match defined for Some';
    case 'Ok':
      return onOk?.(t.unwrap()) ?? 'No match defined for Ok';
    case 'Err':
      return onErr?.(t.unwrapErr()) ?? 'No match defined for Err';
    default:
      return (Err('No pattern matched') as unknown) as B;
  }
};
