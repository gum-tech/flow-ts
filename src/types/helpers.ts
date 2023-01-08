import {Option} from "../option";
import {Result} from "../result";

export type Primitives =
    | number
    | boolean
    | string
    | undefined
    | null
    | symbol
    | bigint;

export type DeepFlatten<T, O> =
    T extends Primitives ?
        O extends Option<any> ? Option<T> : Result<T, T>
    : T extends Option<infer I>
        ? DeepFlatten<I, O>
    : unknown;
