import { Option, None, Some } from '../option/index';
import { Result, Err } from '../result/index';

interface Match<T, E, A, B> {
  Some?: (_: T) => A;
  None?: () => B;
  Ok?: (_: T) => A;
  Err?: (_: E) => B;
}

export const flatten = <A>(
  t: Option<A> | Result<A, A>
): Option<A> | Result<A, A> => {
  switch (t._tag) {
    case 'None':
      return None;
    case 'Some':
      return ((t.unwrap() as unknown) as Option<A>).hasOwnProperty('_tag')
        ? flatten((t.unwrap() as unknown) as Option<A>)
        : t;
    case 'Ok':
      return ((t.unwrap() as unknown) as Result<A, A>).hasOwnProperty('_tag')
        ? flatten((t.unwrap() as unknown) as Result<A, A>)
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

class MatchExpression<value> {
  private readonly _value: value
  constructor(
      value: value
  ) {
    this._value = value
  }

  with() {
    console.log('checking value', this._value)
  }
}

type Match2<p, remainingCases> = {
  with(pattern: p): Match2<p, Exclude<p, Pick<p, infer pattern>>>;
  exhaustive: () => never
}

const match2 = <input, remainingCases = any[]>(
    value: input
): Match2<input, remainingCases> => new MatchExpression(value) as any;

function test(): number {

  type Z = 1 | 2 | 3
  type X = Exclude<Z, 1>
  type X2 = Exclude<X, 2>
  type X3 = Exclude<X2, 3>
  type B = X3 extends never ? true : false

  const value = 1 as Z;
  match2(value)
      .with(2)
      .with(1)
      .exhaustive()


  return 1;
}

test();
