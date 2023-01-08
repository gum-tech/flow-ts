import { None, Option } from '../option';
import { Result, Err, Ok } from '../result';

export type Primitives =
  | number
  | boolean
  | string
  | undefined
  | null
  | symbol
  | bigint;

// T means the current type in the recursion
// L means the last type
// O means the original type
export type DeepFlattenContainers<T, L, O> = T extends Primitives
  ? L extends { _tag: 'Some' }
    ? Option<T>
    : L extends { _tag: 'None' }
    ? None<T>
    : L extends { _tag: 'Ok' }
    ? Ok<T, T>
    : L extends { _tag: 'Err' }
    ? Err<T, T>
    : never
  : T extends Option<infer I>
  ? T extends { _tag: 'None' } | { _tag: 'Some' }
    ? DeepFlattenContainers<I, T, O>
    : never
  : T extends Result<infer R, infer X>
  ? T extends { _tag: 'Err' }
    ? DeepFlattenContainers<X, T, O>
    : T extends { _tag: 'Ok' }
    ? DeepFlattenContainers<R, T, O>
    : never
  : never;
