import { Option, Some, None } from '../option';

interface ResultType<T, E> {
  ok(): Option<T>;
  err(): Option<E>;
}

interface Err<T, E> extends ResultType<T, E> {
  readonly _tag: 'Err';
  readonly value: T | E;
}

interface Ok<T, E> extends ResultType<T, E> {
  readonly _tag: 'Ok';
  readonly value: T;
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export const Ok = <T, E = never>(t: T): Ok<T, E> => ({
  _tag: 'Ok',
  value: t,
  ok: (): Option<T> => Some(t),
  err: (): Option<E> => None,
});

export const Err = <T, E>(e: E): Err<T, E> => ({
  _tag: 'Err',
  value: e,
  ok: (): Option<T> => None,
  err: (): Option<E> => Some(e),
});

export const isOk = <T, E>(a: Result<T, E>): a is Ok<T, E> => a._tag === 'Ok';
export const isErr = <T, E>(a: Result<T, E>): a is Err<T, E> =>
  a._tag === 'Err';
