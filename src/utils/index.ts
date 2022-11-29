import { Option, None } from '../option/index';
import { Result, Err } from '../result/index';

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
