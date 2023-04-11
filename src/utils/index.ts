import { Option } from '../option/index';
import { Result, Err } from '../result/index';
import { DeepFlattenContainers } from '../types/helpers';

type OptionMatcher<T, A, B> = {
  Some?: (_: T) => A;
  None?: () => B;
};

type ResultMatcher<T, E, A, B> = {
  Ok?: (_: T) => A;
  Err?: (_: E) => B;
};

const isOption = <A>(obj: any): obj is Option<A> => {
  return obj && (obj._tag === 'Some' || obj._tag === 'None');
};

const isResult = <A, E>(obj: any): obj is Result<A, E> => {
  return obj && (obj._tag === 'Ok' || obj._tag === 'Err');
};

type Flatten<A, T extends Option<A> | Result<A, A>> = T extends
  | { _tag: 'Some' }
  | { _tag: 'None' }
  | { _tag: 'Ok' }
  | { _tag: 'Err' }
  ? DeepFlattenContainers<T, T, T>
  : never;

// recursively flattens a nested functors or monads into a single type
// @examples
// flatten f a -> f a
// flatten f f a -> f a
// flatten f f f a -> f a
// (fail) flatten f m f a -> f a

export const flatten = <A, F extends Option<A> | Result<A, A>>(
  t: F
): Flatten<A, F> => {
  switch (t._tag) {
    case 'Some':
      //@ts-ignore
      return t.unwrap().hasOwnProperty('_tag') ? flatten(t.unwrap()) : t;
    case 'Ok':
      //@ts-ignore
      return t.unwrap().hasOwnProperty('_tag') ? flatten(t.unwrap()) : t;
    case 'Err':
      //@ts-ignore
      return Err(t?.value);
    default:
      //@ts-ignore
      return t;
  }
};

/**
 * The `match` function is a generic function that allows handling different cases of `Option` and `Result` types.
 * It takes an input `t`, which can be either an `Option<T>` or a `Result<T, E>`, and a `matcher` object containing
 * handler functions for each case: `Some`, `None`, `Ok`, and `Err`.
 *
 * @param t - The input `Option<T>` or `Result<T, E>` to be matched.
 * @param matcher - An object containing handler functions for each case.
 * @returns The result of executing the appropriate handler function or a default message if no handler is provided.
 *
 * @example
 * import { Option, Some, None, Result, Ok, Err, match } from 'your-library';
 *
 * const option: Option<number> = Some(42);
 * const result: Result<string, string> = Err('An error occurred');
 *
 * const optionOutput = match(option, {
 *   Some: (value) => `Value: ${value}`,
 *   None: () => 'No value',
 * });
 *
 * const resultOutput = match(result, {
 *   Ok: (value) => `Success: ${value}`,
 *   Err: (error) => `Error: ${error}`,
 * });
 */
export function match<T, A, B>(
  t: Option<T>,
  matcher: OptionMatcher<T, A, B>
): A | B | string;
export function match<T, E, A, B>(
  t: Result<T, E>,
  matcher: ResultMatcher<T, E, A, B>
): A | B | string;
export function match<T, E, A, B>(
  t: Option<T> | Result<T, E>,
  matcher: OptionMatcher<T, A, B> | ResultMatcher<T, E, A, B>
): A | B | string {
  switch (t._tag) {
    case 'None':
      return (
        (matcher as OptionMatcher<T, A, B>).None?.() ??
        'No match defined for None'
      );
    case 'Some':
      return (
        (matcher as OptionMatcher<T, A, B>).Some?.(t.unwrap()) ??
        'No match defined for Some'
      );
    case 'Ok':
      return (
        (matcher as ResultMatcher<T, E, A, B>).Ok?.(t.unwrap()) ??
        'No match defined for Ok'
      );
    case 'Err':
      return (
        (matcher as ResultMatcher<T, E, A, B>).Err?.(t.unwrapErr()) ??
        'No match defined for Err'
      );
    default:
      return (Err('No pattern matched') as unknown) as B;
  }
}

export const equals = <A, E>(
  obj1: Option<A> | Result<A, E>,
  obj2: Option<A> | Result<A, E>
): boolean => {
  if (obj1._tag !== obj2._tag) {
    return false;
  }

  if (isOption(obj1) && isOption(obj2)) {
    if (obj1._tag === 'None') {
      return obj2._tag === 'None';
    } else {
      return Object.is(obj1.unwrap(), obj2.unwrap());
    }
  } else if (isResult(obj1) && isResult(obj2)) {
    if (obj1._tag === 'Err') {
      return Object.is(obj1.unwrapErr(), obj2.unwrapErr());
    } else {
      return Object.is(obj1.unwrap(), obj2.unwrap());
    }
  }

  return false;
};
