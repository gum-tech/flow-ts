import { expectType, expectError } from 'tsd'
import { flatten, Some, None, Ok, Err, Result } from '../src/index'

{ // spec flatten Some a -> Some a
    type MatchSome<T> = T extends Some<any> ? true : false
    type Z = MatchSome<Some<1>>
    const x = flatten(Some(1))
    expectType<None<any> | Some<number>>(x)

    // should not return an unexpected type
    expectError<Ok<number, number>>(x)
}

{ // spec flatten Some Some a -> Some a
    const x = flatten(Some(Some(1)))
    expectType<None<any> | Some<number>>(x)
}

{ // spec flatten None -> None
    const x = flatten(None)
    expectType<None<any>>(x)
}

{ // spec flatten Some Some None -> None
    const x = flatten(Some(Some(None)))
    expect<None<any>>(x)
}

{ // spec flatten Ok a -> Ok a
    const x = flatten(Ok(1))
    expectType<Err<unknown, unknown> | Ok<number, number>>(x)

    // should not return an unexpected type
    expectError<Some<number>>(x)
}

{ // spec flatten Ok Ok a -> Ok a
    const x = flatten(Ok(Ok(1)))
    expectType<Err<unknown, unknown> | Ok<number, number>>(x)
}

{ // spec flatten Ok Ok Err a -> Err a
    const x = flatten(Ok(Ok(Err(1))))
    expectType<Result<unknown, number>>(x)
}
