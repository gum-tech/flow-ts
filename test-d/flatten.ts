import { expectType } from 'tsd'
import { flatten, Some, Option, None, Ok } from '../src/index'

{ // spec flatten Some a -> Some a
    const x = flatten(Some(1))
    expectType<Option<number>>(x)
}

{ // spec flatten Some Some a -> Some a
    const x = flatten(Some(Some(1)))
    expectType<Option<number>>(x)
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
}
