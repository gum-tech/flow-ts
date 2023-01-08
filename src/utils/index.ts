// @ts-nocheck
import { Option, None, Some } from '../option/index';
import { Result, Err } from '../result/index';
import { DeepFlattenContainers } from "../types/helpers";

interface Match<T, E, A, B> {
  Some?: (_: T) => A;
  None?: () => B;
  Ok?: (_: T) => A;
  Err?: (_: E) => B;
}

type Flatten<A, T extends Option<A> | Result<A, A>> =
  T extends { _tag: 'Some' } | { _tag: 'None' } | { _tag: 'Ok' } | { _tag: 'Err' }
    ? DeepFlattenContainers<T, T, T>
  : never

// recursively flattens a nested functors or monads into a single type
// @examples
// flatten f a -> f a
// flatten f f a -> f a
// flatten f f f a -> f a
// (fail) flatten f m f a -> f a
export const flatten = <T, F extends Option<T> | Result<T, T>>(
  t: F
): Flatten<T, F> => {
  switch (t._tag) {
    case 'Some':
      return t.unwrap().hasOwnProperty('_tag')
        ? flatten(t.unwrap())
        : t;
    case 'Ok':
      return t.unwrap().hasOwnProperty('_tag')
        ? flatten(t.unwrap())
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
