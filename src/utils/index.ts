import { Option, None } from '../option/index';
import { Result, Err } from '../result/index';

type Flatten<T, E> = Option<T> | Result<T, E>;

export const flatten = <T, E>(t: Flatten<T, E>): Flatten<T, E> => {
  switch (t._tag) {
    case 'None':
      return None;
    case 'Some':
      return ((t.unwrap() as unknown) as Option<T>).hasOwnProperty('_tag')
        ? flatten((t.unwrap() as unknown) as Option<T>)
        : t;
    case 'Ok':
      return ((t.unwrap() as unknown) as Result<T, E>).hasOwnProperty('_tag')
        ? flatten((t.unwrap() as unknown) as Result<T, E>)
        : t;
    case 'Err':
      return ((t.unwrapErr() as unknown) as Result<T, E>).hasOwnProperty('_tag')
        ? Err(('Cannot wrap option/result in Err()' as unknown) as E)
        : t;
    default:
      return t;
  }
};
