import {None, Option, Some} from "../option";
import {Result, Err, Ok} from "../result";

export type Simplify<T> = {[KeyType in keyof T]: T[KeyType]};

export type Primitives =
    | number
    | boolean
    | string
    | undefined
    | null
    | symbol
    | bigint;

export type DeepFlattenContainers<T, L, O> =
    T extends Primitives ?
        // NOTE: Option type should improve, None cannot have a generic, we can only aggressively omit None for the time being
        O extends Option<any>
            // ? Exclude<Option<T>, None<any>>
            ? Some<T>
        // : Exclude<Result<T, T>, Err<unknown, unknown>>
        : Result<T, unknown>
    : T extends Option<infer I>
        ? T extends { _tag: 'None' }
            ? None<any>
            : DeepFlattenContainers<I, T, O>
    : T extends Result<infer R, infer X>
        ? T extends { _tag: 'Err' }
            ? Err<unknown, X>
        : T extends { _tag: 'Ok' }
            ? DeepFlattenContainers<R, T, O>
            : unknown
    : unknown;
