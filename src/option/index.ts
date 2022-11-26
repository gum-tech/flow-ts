interface OptionType<T> {
  bind<A>(_: (_: T) => Option<A>): Option<A>;
  map<A>(_: (_: T) => A): Option<A>;
  filter(predicate: Predicate<T>): Option<T>;
  unwrap(): T | never;
  expect<A>(_: A): A | T;
  unwrapOr(_: T): T;
  flatten(): Option<T>;
  or<A>(_: Option<A>): Option<T | A>;
  and<A>(_: Option<A>): Option<A>;
  toPromise(): Promise<T>;
}

interface None<T> extends OptionType<T> {
  readonly _tag: 'None';
}

interface Some<T> extends OptionType<T> {
  readonly _tag: 'Some';
  readonly value: T;
}

interface Predicate<A> {
  (a: A): boolean;
}

interface Match<T, A, B> {
  some: (_: T) => A;
  none: () => B;
}

export type Option<T> = None<T> | Some<T>;

const noneBuilder = <T>(): None<T> => ({
  _tag: 'None',
  bind: <A>(_: (_: T) => Option<A>): Option<A> => noneBuilder<A>(),
  map: <A>(_: (_: T) => A): Option<A> => noneBuilder<A>(),
  filter: (_: Predicate<T>): None<T> => None,
  unwrap: (): never => {
    throw new ReferenceError('`Option.unwrap()` on a `None` value');
  },
  expect: <A>(a: A): never => {
    throw new Error(`${a}`);
  },
  unwrapOr: (a: T): T => a,
  flatten: (): None<T> => None,
  or: <A>(a: Option<A>): Option<A> => a,
  and: <A>(_: Option<A>): None<A> => None,
  toPromise(): Promise<T> {
    return Promise.reject();
  },
});

const someBuilder = <T>(t: T): Option<T> => ({
  _tag: 'Some',
  value: t,
  bind: <A>(fn: (_: T) => Option<A>): Option<A> => fn(t),
  map: <A>(fn: (_: T) => A): Option<A> => Some(fn(t)),
  filter: (predicate: Predicate<T>): Option<T> =>
    predicate(t) ? Some(t) : None,
  unwrap: (): T => t,
  expect: <A>(_: A): T => t,
  unwrapOr: (_: T): T => t,
  flatten: (): Option<T> =>
    isSome((t as unknown) as Option<T>) || isNone((t as unknown) as Option<T>)
      ? ((t as unknown) as Option<T>)
      : Some(t),
  or<A>(_: Option<A>): Some<T> {
    return this;
  },
  and: <A>(a: Option<A>): Option<A> => a,
  toPromise(): Promise<T> {
    return Promise.resolve(t);
  },
});

export const Some = <T>(t?: T | undefined): Option<T> =>
  typeof t === 'undefined' ? noneBuilder<T>() : someBuilder<T>(t as T);
export const None = noneBuilder<any>();
export const isSome = <T>(a: Option<T>): a is Some<T> => a._tag === 'Some';
export const isNone = <T>(a: Option<T>): a is None<T> => a._tag === 'None';
export const match = <T, A, B>(t: Option<T>) => ({
  some: onSome,
  none: onNone,
}: Match<T, A, B>): A | B => (isNone(t) ? onNone() : onSome(t.value));
