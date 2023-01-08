import { expectType } from 'tsd'
import { flatten, Some, Option } from '../src/index'

{ // spec flatten Some a -> Some a
    const x = flatten(Some(1))
    expectType<Option<number>>(x)
}

{ // spec flatten Some Some a -> Some a
    const x = flatten(Some(Some(1)))
    expectType<Option<number>>(x)
}
