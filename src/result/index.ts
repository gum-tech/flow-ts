import { Option, Some, None } from '../option';

interface ResultType<T, E> {
  ok(): Option<T>;
  err(): Option<E>;
  unwrap(): T | never;
  unwrapOr(_: T): T;
  unwrapOrElse(_: (_: E) => T): T;
  unwrapErr(): E | never;
  expect<A>(_: A): A | T;
  expectErr<A>(_: A): A | E;
  andThen<A>(_: (_: T) => Result<A, E>): Result<A, E>;
  map<A>(_: (_: T) => A): Result<A, E>;
  mapErr<A>(_: (_: E) => A): Result<T, A>;
  or<A>(_: Result<A, E>): Result<T | A, E>;
  orElse<A>(_: (_: E) => Result<A, E>): Result<T | A, E>;
  and<A>(_: Result<A, E>): Result<T | A, E>;
}

export interface Err<T, E> extends ResultType<T, E> {
  readonly _tag: 'Err';
  readonly value: T | E;
}

export interface Ok<T, E> extends ResultType<T, E> {
  readonly _tag: 'Ok';
  readonly value: T;
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export const Ok = <T, E>(t: T): Result<T, E> => ({
  _tag: 'Ok',
  value: t,
  ok: (): Option<T> => Some(t),
  err: (): Option<E> => None,
  unwrap: (): T => t,
  unwrapOr: (_: T): T => t,
  unwrapOrElse: (_: (_: E) => T): T => t,
  unwrapErr: (): never => {
    throw new ReferenceError('`Result.unwrapErr()` on a `Ok` value');
  },
  expect: <A>(_: A): T => t,
  expectErr: () => {
    throw new ReferenceError('`Result.expectErr()` on a `Ok` value');
  },
  map: <A>(fn: (_: T) => A): Result<A, E> => Ok(fn(t)),
  mapErr: <A>(_: (_: E) => A): Result<T, A> => Ok(t),
  andThen: <A>(fn: (_: T) => Result<A, E>): Result<A, E> => fn(t),
  or<A>(_: Result<A, E>): Ok<T | A, E> {
    return this;
  },
  orElse<A>(_: (_: E) => Result<A, E>): Ok<T | A, E> {
    return this;
  },
  and: <A>(a: Result<A, E>): Result<A, E> => a,
});

export const Err = <T, E>(e: E): Err<T, E> => ({
  _tag: 'Err',
  value: e,
  ok: (): Option<T> => None,
  err: (): Option<E> => Some(e),
  unwrap: (): never => {
    throw new ReferenceError('`Result.unwrap()` on a `Err` value');
  },
  unwrapOr: (a: T): T => a,
  unwrapOrElse: (fn: (_: E) => T): T => fn(e),
  unwrapErr: (): E => e,
  expect: <A>(a: A): never => {
    throw new Error(`${a}`);
  },
  expectErr: <A>(_: A): E => e,
  map: <A>(_: (_: T) => A): Err<A, E> => Err(e),
  mapErr: <A>(fn: (_: E) => A): Result<T, A> => Err(fn(e)),
  andThen: <A>(_: (_: T) => Err<A, E>): Err<A, E> => Err(e),
  or: <A>(a: Result<A, E>): Result<A, E> => a,
  orElse: <A>(fn: (_: E) => Result<A, E>): Result<T | A, E> => fn(e),
  and<A>(_: Result<A, E>): Err<T | A, E> {
    return this;
  },
});

export const isOk = <T, E>(a: Result<T, E>): a is Ok<T, E> => a._tag === 'Ok';
export const isErr = <T, E>(a: Result<T, E>): a is Err<T, E> =>
  a._tag === 'Err';
