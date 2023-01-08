import { Result, Err, Ok } from '../result';

interface OptionType<T> {
  andthen<A>(_: (_: T) => Option<A>): Option<A>;
  map<A>(_: (_: T) => A): Option<A>;
  filter(predicate: Predicate<T>): Option<T>;
  unwrap(): T | never;
  expect<A>(_: A): A | T;
  unwrapOr(_: T): T;
  unwrapOrElse(_: () => T): T;
  or<A>(_: Option<A>): Option<T | A>;
  orElse(_: () => Option<T>): Option<T>;
  and<A>(_: Option<A>): Option<A>;
  okOr<E>(_: E): Result<T, E>;
}

export interface None<T> extends OptionType<T> {
  readonly _tag: 'None';
}

export interface Some<T> extends OptionType<T> {
  readonly _tag: 'Some';
  readonly value: T;
}

interface Predicate<A> {
  (a: A): boolean;
}

export type Option<T> = None<T> | Some<T>;

const noneBuilder = <T>(): None<T> => ({
  _tag: 'None',
  andthen: <A>(_: (_: T) => Option<A>): Option<A> => noneBuilder<A>(),
  map: <A>(_: (_: T) => A): Option<A> => noneBuilder<A>(),
  filter: (_: Predicate<T>): None<T> => None,
  unwrap: (): never => {
    throw new ReferenceError('`Option.unwrap()` on a `None` value');
  },
  expect: <A>(a: A): never => {
    throw new Error(`${a}`);
  },
  unwrapOr: (a: T): T => a,
  unwrapOrElse: (fn: () => T): T => fn(),
  or: <A>(a: Option<A>): Option<A> => a,
  orElse: (fn: () => Option<T>): Option<T> => fn(),
  and: <A>(_: Option<A>): None<A> => None,
  okOr: <E>(e: E): Result<T, E> => Err(e),
});

const someBuilder = <T>(t: T): Option<T> => ({
  _tag: 'Some',
  value: t,
  andthen: <A>(fn: (_: T) => Option<A>): Option<A> => fn(t),
  map: <A>(fn: (_: T) => A): Option<A> => Some(fn(t)),
  filter: (predicate: Predicate<T>): Option<T> =>
    predicate(t) ? Some(t) : None,
  unwrap: (): T => t,
  expect: <A>(_: A): T => t,
  unwrapOr: (_: T): T => t,
  unwrapOrElse: (_: () => T): T => t,
  or<A>(_: Option<A>): Some<T> {
    return this;
  },
  orElse(_: () => Option<T>): Some<T> {
    return this;
  },
  and: <A>(a: Option<A>): Option<A> => a,
  okOr: <E>(_: E): Result<T, E> => Ok(t),
});

export const Some = <T>(t?: T | undefined): Option<T> =>
  typeof t === 'undefined' ? noneBuilder<T>() : someBuilder<T>(t as T);
export const None = noneBuilder<any>();
export const isSome = <T>(a: Option<T>): a is Some<T> => a._tag === 'Some';
export const isNone = (a: Option<any>): a is None<any> => a._tag === 'None';
