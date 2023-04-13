import { Result, Ok, Err, isOk } from '../index';

interface AsyncResultType<T, E> {
  map<A>(fn: (_: T) => A): AsyncResult<A, E>;
  mapErr<A>(fn: (_: E) => A): AsyncResult<T, A>;
  andThen<A>(fn: (_: T) => AsyncResult<A, E>): AsyncResult<A, E>;
  /**
   * Attaches callbacks for the resolution of the AsyncResult.
   */
  then<TResult>(
    onfulfilled?:
      | ((value: Result<T, E>) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<TResult>;
}

// AsyncResult<T, E>
// Promise
// Promise that resolves to a Result<T, E>
// works with standard Promise operations like then, catch, and finally
// AsyncResultType<T, E>
// provide more convenient and expressive ways to handle errors, chain operations, and transform values
// when working with asynchronous operations that return Result values.
export type AsyncResult<T, E> = Promise<Result<T, E>> & AsyncResultType<T, E>;

/**
 * Attaches functions from the AsyncResultType<T, E> interface to the given promise.
 */
const attachFns = <T, E>(promise: Promise<Result<T, E>>): AsyncResult<T, E> => {
  const asyncResult = promise as AsyncResult<T, E>;

  asyncResult.map = function<A>(fn: (_: T) => A): AsyncResult<A, E> {
    return attachFns(promise.then((result: Result<T, E>) => result.map(fn)));
  };

  asyncResult.mapErr = function<A>(fn: (_: E) => A): AsyncResult<T, A> {
    return attachFns(promise.then((result: Result<T, E>) => result.mapErr(fn)));
  };

  asyncResult.andThen = function<A>(
    fn: (_: T) => AsyncResult<A, E>
  ): AsyncResult<A, E> {
    return attachFns(
      promise.then((result: Result<T, E>) => {
        if (isOk(result)) {
          return fn(result.unwrap());
        }
        return AsyncErr(result.unwrapErr());
      })
    );
  };

  return asyncResult;
};

/**
 * Wraps a successful value of type T into an AsyncResult<T, E>.
 */
export const AsyncOk = <T, E>(t: T): AsyncResult<T, E> => {
  const result = Ok<T, E>(t);
  return attachFns(Promise.resolve(result));
};

/**
 * Wraps an error value of type E into an AsyncResult<T, E>.
 */
export const AsyncErr = <T, E>(e: E): AsyncResult<T, E> => {
  const result = Err<T, E>(e);
  return attachFns(Promise.resolve(result));
};
