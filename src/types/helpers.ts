import {None, Option} from "../option";
import {Result} from "../result";

export type Primitives =
    | number
    | boolean
    | string
    | undefined
    | null
    | symbol
    | bigint;

export type DeepFlattenContainers<T, O> =
    T extends Primitives ?
        O extends Option<any> ? Option<T> : Result<T, T>
    : T extends Option<infer I>
        ? T extends { _tag: 'None' }
            ? None<any>
            : DeepFlattenContainers<I, O>
    : unknown;
