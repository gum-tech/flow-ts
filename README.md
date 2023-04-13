Dominate exceptions and missing values in Typescript & Javascript.

## What is flow-ts?

`flow-ts` is a library for Typescript and JavaScript that aims to safely handle exceptions and missing values, similar to how Rust handles them with its `Option` and `Result` types.

## Why flow-ts?

In JS, `null` represents intentionally missing values, `undefined` represents unintentional missing values, and Exceptions are used for handling errors.

Rust skips using missing values and exceptions. Mainly to prevent issues and bugs like:

- null pointer errors
- runtime errors
- unexpected behaviour
- unhandled exceptions
- sensitive data leakages through exceptions
- race conditions
- and so on.

Instead, Rust provides two special generic `Option` and `Result` to deal with the above cases.

flow-ts implements the `Option` & `Result` types for Typescript & Javascript.

## Why should you use flow-ts?
There are already several excellent libraries that implement functional patterns in Typescript. Why flow-ts?

These libraries are usually general-purpose toolkits aiming to implement all the functional programming patterns and abstractions. flow-ts has a more focused goal. We wanted a library specifically to ~~dominate~~ **safely** handle exceptions and missing values (null, undefined). The same way as it’s implemented in Rust.

Other distinguishing features of flow-ts:

- Zero dependencies: flow-ts has no external dependencies.
- Practical: • Rather than bore you with all the Monad / Category theory talk, we focus on the practical applications of Monads in a way you can use today. Just as you don’t need to understand group theory to do basic arithmetic, you don’t need to understand monad theory to use flow-ts.
- 100% functions: • Some other libraries implement Option and Result monad with OOP style and patterns under the hood. We choose an utterly functional approach. Immutability and side-effect-free functions are at the heart of flow-ts design philosophy.

Convinced?

Great! Let’s get started.

## Installation

Npm
```markdown
> npm install @gum-tech/flow-ts
```

Yarn
```markdown
> yarn add @gum-tech/flow-ts
```

Deno
```markdown
> import { Some, None, Ok, Err, AsyncOk, AsyncErr } from 'https://deno.land/x/flowts/mod.ts'
```

If you find this package useful, please click the star button *✨*!

<div id="toc"></div>

## Table of contents
- `Option<T>`
    - [Introduction](#introduction)
    - [Basic usage](#basic-usage)
    - [Benefits](#benefits)
    - [API](#api)
    - [API documentation](#api-documentation)
- `Result<T,E>`
    - [Introduction](#introduction-1)
    - [Basic usage](#basic-usage-1)
    - [Benefits](#benefits-1)
    - [API](#api-1)
    - [API documentation](#api-documentation-1)
- `AsyncResult<T,E>`
    - [Introduction](#introduction-2)
    - [Basic usage](#basic-usage-2)
    - [Benefits](#benefits-2)
    - [API](#api-2)
    - [API documentation](#api-documentation-2)
- Utils
    - [Flatten](#flatten)
    - [Pattern matching](#pattern-matching)
    - [Equals](#equals)

## `Option<T>`

### **Introduction**

“Null has led to innumerable errors, vulnerabilities, and system crashes, which have probably caused a billion dollars of pain and damage in the last forty years.” - Tony Hoare, the inventor of null

**`null`** values  can be difficult to detect and handle correctly. When a **`null`** value is encountered, it may not be immediately clear why it is there or how to handle it. This can lead to bugs that are hard to diagnose and fix.

Another problem with **`null`** values is that they can cause runtime errors if they are not properly handled. For example, if a program attempts to access a property of an object that is **`null`**, it will often raise a **`NullPointerException`** or similar error. These errors can be difficult to anticipate and debug, especially if they occur deep in the codebase or if there are many layers of abstraction involved.

To avoid these problems, we use Option monad as an alternative way of representing the absence of a value or the lack of an object reference.

A monad is a design pattern that allows for the creation of sequenced computations, or "actions," that can be combined in a predictable way.

The option monad is a specific type of monad that represents computations that may or may not return a value.

Option monad types allow for the explicit representation of the possibility of a missing value, and they provide methods for handling these cases in a predictable and composable way.

The option monad is usually implemented as an algebraic data type with two cases: **`Some`** and **`None`**. The **`Some`** case represents a computation that has a value, and it is parameterized by the type of the value. The **`None`** case represents a computation that has a missing value.

```tsx
type Option<T> = None | Some<T>
```

Option monad helps us safely handle missing values in a predictable and composable way without being afraid of the null pointer exception, runtime errors, and unexpected behaviour in our code.

[⬆️  Back to top](#toc)


## **Basic usage**

 **Example I**

  Let’s start with a common example you see in many codebases today.

  ```tsx
  interface User {
    id: number,
    fullname: string,
    username: string,
  }

  const users: User[] = [
    {
      id: 1,
      fullname: "Leonardo Da Vinci",
      username: "leo"
    },
    {
      id: 2,
      fullname: "Galileo Galilei",
      username: "gaga"
    }
  ]

  function getUser(id: number): User | null {
    return users.find(user => user.id === id) ?? null;
  }

  function getUserName(id: number): string | null {
    const user = getUser(id);
    if (user === null) {
      return null;
    }
    return user.username;
  }

  const username = getUserName(1);

  if (username !== null) {
    console.log(username);
  } else {
    console.log("User not found");
  }
  ```

  This code focuses on telling the computer how to perform a task, step by step. It involves specifying the sequence of actions that the computer should take and the specific operations it should perform at each step.

  The code also uses null to define missing values. Even with a simple example like this, it’s not immediately clear where the null is coming from when we check if the username is null. In large codebases, this can be a nightmare to diagnose and fix.

  However, since this code style is more familiar and follows a more traditional control flow, it can be easier to understand for most programmers.

  Let's rewrite this with a declarative style using flow-ts option monad

  ```tsx
  import { Option, Some, None, match } from 'flow-ts';

  const getUser = (id: number): Option<User> => Some(users.find(user => user.id === id));

  const getUserName = (id: number): Option<string> => getUser(id).map(user => user.username);

  match(getUserName(2))({
      Some: username => console.log(username),
      None: () => console.log("User not found"),
  })
  ```

  This code style focuses on describing the input (the user's ID) and the desired output (the username).
  The match function handles the case where the user is not found by providing a default value (in this case, a message saying "User not found").

  With flow-ts, we have  successfully handled missing values in a predictable and composable way.

  **Example II**

  Let’s look at another example of using option to handle optional values.

  if the value of an object can be empty or optional like the `middle_name`of `User` in the following example, we can set its data type as an `Option`type.

  ```tsx
  import { Option, Some, None, match } from 'flow-ts';

  interface User {
    firstName: string;
    middleName: Option<string>; // middle name can be empty
    lastName: string;
  }

  const getFullName = ({ firstName, middleName, lastName }: User): string => (

    match(middleName)({
      Some: mName => `${firstName} ${mName} ${lastName}`,
      None: () => `${firstName} ${lastName}`,
    })
  )

  getFullName({firstName: "Galileo", middleName: None, lastName: "Galilei"}); // Galileo Galilei
  getFullName({firstName: "Leonardo", middleName: Some("Da"), lastName: "Vinci"}); // Leonardo Da Vinci
  ```

  **Example III**

  Let’s look at another example by chaining calculations

  ```tsx
  import { Option, Some, None, match } from 'flow-ts';

  const sine = (x: number): Option<number> =>  Some(Math.sine(x));
  const cube = (x: number): Option<number> => Some(x * x * x);
  const inc = (x: number): Option<number> => Some(x + 1);
  const double = (x: number): Option<number> => Some(x * x);
  const divide = (x: number, y: number): Option<number> => y > 0 ? Some(x/y) : None

  const sineCubedIncDoubleDivideBy10 = (x: number): Option<number> =>
                                                                    Some(x)
                                                                    .andThen(sine)
                                                                    .andThen(cube)
                                                                    .andThen(inc)
                                                                    .andThen(double)
                                                                    .andThen(divide);

  match(sineCubedIncDoubleDivideBy10(30))({
    Some: result => console.log(`Result is ${result}`),
    None: () => console.log(`Please check your inputs`)
  })
  ```

  **Example IV**

  Example III with map

  ```tsx
  import { Option, Some, None, match } from 'flow-ts';

  const sine = (x: number): number =>  Math.sine(x);
  const cube = (x: number): number => x * x * x;
  const inc = (x: number): number => x + 1;
  const double = (x: number): number => x * x;

  const sineCubedIncDouble = (x: number): Option<number> =>
                                                          Some(x)
                                                          .map(sine)
                                                          .map(cube)
                                                          .map(inc)
                                                          .map(double)

  match(sineCubedIncDouble(30))({
    Some: result => console.log(`Result is ${result}`),
    None: () => console.log(`Please check your inputs`)
  }
  ```
[⬆️  Back to top](#toc)

### **Benefits**

  There are several reasons why you might want to use the option monad in your code:

  1. To avoid **`null reference exceptions`**: As mentioned earlier, the option monad is a way of representing optional values in a type-safe way. This can help you avoid **`null reference exceptions`** by allowing you to explicitly handle the absence of a value in your code.
  2. To make your code more readable: Using the option monad can make your code more readable, because it clearly indicates when a value may be absent. This can make it easier for other developers to understand your code and can reduce the need for comments explaining how **`null`** values are handled.
  3. To improve code reliability: By explicitly handling the absence of a value, you can make your code more reliable and less prone to runtime errors.
  4. To improve code maintainability: Using the option monad can make your code more maintainable, because it encourages a clear and explicit handling of optional values. This can make it easier to modify and extend your code in the future.
  5. To make you write code that is more declarative and less imperative. This can make your code easier to understand and test.

[⬆️  Back to top](#toc)

### **API**

  flow-ts Option exposes the following:

  - `isSome` returns true if the option is a `Some` value, false otherwise.
  - `isNone` returns true if the option is a `None` value, false otherwise.
  - `unwrap` extract the value out of `Option<T>`. It will raise an error if you call it on `None`. You can use `unwrapOr` for safe unwrapping.
  - `unwrapOr` has one argument of the same type as `T` in `Option<T>.` It unwraps the value in case of `Some` or returns the argument value back in case of `None`. It's a safe and recommended way of extracting values.
  - `expect` similar to `unwrap` but can accept an argument for setting a custom message for the error.
  - `unwrapOrElse` similar to `unwrapOr`. The only difference is, instead of passing a value, you have to pass a closure which returns a value with the same data type as `T` in `Option<T>`
  - `okOr` transform `Option` type into `Result`type. **`Some` to `Ok` and `None` to `Err`.** A default error message must be passed as an argument.
  - `map` allows for the transformation of the value contained in a **`Some`**instance. E.g `Option<T>`to `Option<U>`. Only `Some` values are getting changed - no effect to `None`.
  - `andThen`  allows for safe chaining of multiple option monad computations and returns `None`if the option is `None` anywhere on the chain.
  - `or` when combining two expressions. If either one got `Some`, that value returns immediately.
  - `orElse` Similar to `or`. The only difference is that the second expression should be a closure that returns the same type `T`
  - `and` when combining two expressions, If both got `Some`, the value in the second expression returns. If either one got `None` that value returns immediately.
  - `filter` accepts a predicate as an argument. The predicate uses the value inside `Some` as an argument. The same `Some` type is returned only if we pass a `Some` value and the predicate returns true. `None` is returned if a `None` type is passed or the predicate returns false.

  ```tsx
  import {
    isSome,
    isNone,
    unwrap,
    unwrapOr,
    expect,
    unwrapOrElse,
    OkOr,
    andThen,
    or,
    and,
    map,
    filter,
    orElse
  } from 'flow-ts'
  ```

[⬆️  Back to top](#toc)

### **API Documentation**

  `isSome` 

  returns true if the option is a `Some` value, false otherwise.

  **Example**

  ```tsx
  import { Some, None, isSome } from 'flow-ts'

  isSome(Some(1)) // true
  isSome(None), // false
  ```

  `isNone` 

  returns true if the option is a `None` value, false otherwise.

  **Example**

  ```tsx
  import { Some, None, isNone } from 'flow-ts'

  isNone(some(1)) // false
  isNone(none) // true
  ```

  `unwrap` 

  extract the value out of `Option<T>`. It will raise an error if you call it on `None`. You can use `unwrapOr`for safe unwrapping.

  Throws a `ReferenceError` if the option is `None`.

  **Example**

  ```tsx
  import { Some, None } from 'flow-ts'

  Some("car").unwrap() // "car"
  None.unwrap() // fails, throws an Exception
  ```

  `unwrapOr` 

  has one argument of the same type as `T` in `Option<T>.` It unwraps the value in case of `Some`or returns the argument value back in case of `None`. It's a safe and recommended way of extracting values.**Signature**

  **Example**

  ```tsx
  import { Some, None } from 'flow-ts'

  Some("car").unwrapOr("bike") // "car"
  None.unwrapOr("bike") // "bike"
  ```

  `expect` 

  similar to `unwrap()`but can accept an argument for setting a custom message for the error.

  **Example**

  ```tsx
  import { Some, None } from 'flow-ts'

  Let n = None;
  n.expect("empty value returned"); //ReferenceError: empty value returned
  ```

  `unwrapOrElse` 

  similar to `unwrap_or()`. The only difference is, instead of passing a value, you have to pass a closure which returns a value with the same data type as `T` in `Option<T>`

  **Example**

  ```tsx
  import { Some, None } from 'flow-ts'

  let fnElse = () => 16;

  Some(8).unwrap_or_else(fnElse) // 8
  None.unwrap_or_else(() => 'error returned') // 'error returned'
  ```

  `okOr` 

  transform `Option` type into `Result`type. **`Some` to `Ok` and `None` to `Err`.** A default error message must be pass as argument.

  **Example**

  ```tsx
  import { Some, None, Option } from 'flow-ts'

  const errDefault = "error message";

  const s: Option<string> = Some("abc")
  const n = None

  s.okOr(errDefault) // Ok("abc")
  n.okOr(errDefault) // Err("error message")
  ```

  `map` 

  allows for the transformation of the value contained in a **`Some`** instance.

  E.g `Option<T>`to `Option<U>`.

  Only `Some` values are getting changed.

  No effect to `None`.

  **Example**

  ```tsx
  import { Some, None } from 'flow-ts'

  const cube = (x: number) : number => x * x * x
  Some(10).map(x => x + 1).map(cube).map(y => y * 2) // Some(2662)
  ```

  `andThen` 

  allows for safe chaining of multiple option monad computations. And returns `None`if the option is `None` anywhere on the chain.

  **Example**

  ```tsx
  import { Some, None, Option } from 'flow-ts'

  const sine = (x: number): Option<number> =>  Some(Math.sine(x));
  const cube = (x: number): Option<number> => Some(x * x * x);
  const inc = (x: number): Option<number> => Some(x + 1);
  const double = (x: number): Option<number> => Some(x * x);
  const divide = (x: number, y: number): Option<number> => y > 0 ? Some(x/y) : None

  const sineCubedIncDoubleDivideBy10 = (val: number): Option<number> =>
  Some(val)
  .andThen(sine)
  .andThen(cube)
  .andThen(inc)
  .andThen(double)
  .andThen(divide);

  match(sineCubedIncDoubleDivideBy10(30))({
    Some: result => console.log(`Result is ${result}`),
    None: () => console.log(`Please check your inputs`)
  })
  ```

  `or` 

  when combining two expressions If either one got `Some`, that value returns immediately.

  **Examples**

  ```tsx
  import { Some, None, Option } from 'flow-ts'

  let s1: Option<string> = Some("some1")
  let s2: Option<string> = Some("some2")
  let n = None;

  s1.or(s2); // => Some("some1")
  s1.or(n); // => Some("some1")
  n.or(s1); // => Some("some1")
  n.or(n); // => None
  ```

  ```tsx
  import { Some, None } from 'flow-ts'

  const inc = (x) => Some(x + 1)

  Some(5).andThen(inc).or(Some(0)) // => Some(6)
  Some(undefined).andThen(inc).or(Some(0)) // => Some(0)
  ```

  `orElse` 

  Similar to `or`. The only difference is, the second expression should be a closure which returns same type `T`.

  **Example**

  ```tsx
  import { Some, None, Option } from 'flow-ts'

  let s1: Option<string> = Some("some1")
  let sFn = () => Some("some2")
  let n: Option<string> = None;
  let nFn = () => None

  s1.orElse(sFn); // => Some("some1")
  s1.orElse(nFn); // => Some("some1")
  n.orElse(sFn); // => Some("some2")
  n.orElse(nFn); // => None
  ```

  `and` 

  when combining two expressions If both got `Some`, the value in the second expression returns. If either one got `None`that value returns immediately.

  **Example**

  ```tsx
  import { Some, None, Option } from 'flow-ts'

  let s1: Option<string> = Some("some1")
  let s2: Option<string> = Some("some2")
  let n: Option<string> = None;

  s1.and(s2); // => Some("some2")
  s1.and(n); // => None
  n.and(s1); // => None
  n.and(n); // => None
  ```

  `filter` 

  accepts a predicate as an argument. The same `Some`type is returned, only if we pass a `Some`value and predicate returns true for it. `None`is returned, if `None`
   type passed or the predicate returns false. The predicate uses the value inside `Some`
   as an argument.

  **Example**

  ```tsx
  import { Some, None, Option } from 'flow-ts'

  let s1: Option<number> = Some(3);
  let s2: Option<number> = Some(6);
  let n = None;

  const isEVen = (val: number): number => val % 2 == 0;

  s1.filter(fn_is_even);  // Some(3) -> 3 is not even -> None
  s2.filter(fn_is_even); // Some(6) -> 6 is even -> Some(6)
  n.filter(fn_is_even);  // None -> no value ->
  ```

  ---

  If you find this package useful, please click the star button *✨*!

  [⬆️  Back to top](#toc)

## Result<T, E>

### **Introduction**

  Exceptions are a mechanism for handling errors and exceptional circumstances in many programming languages. When an exception is thrown, the normal flow of control in the program is interrupted, and the program tries to find an exception handler to handle the exception. If no appropriate exception handler is found, the program may crash or produce unexpected results.

  There are several problems with using exceptions for error handling:

  1. Exceptions can be difficult to anticipate: Exceptions can be thrown anywhere in the code, making it difficult to anticipate where they might occur and how to handle them. This can make it hard to write robust, reliable code.
  2. Exceptions can be hard to debug: When an exception is thrown, the normal flow of control in the program is interrupted, making it difficult to trace the cause of the exception and fix the error.
  3. Exceptions can make code harder to read: When exceptions are used extensively, the code can become cluttered with try-catch blocks, making it harder to understand what is happening.
  4. Exceptions can have performance overhead: Throwing and catching exceptions can have a significant performance overhead, especially if they are used extensively.

  The result monad is a way to handle errors and exceptions in a more predictable and structured way. Instead of using exceptions, the result monad uses a variant-based approach, with separate **`Ok`** and **`Err`** variants representing successful and unsuccessful computations, respectively. This allows for more predictable error handling and makes it easier to anticipate and handle errors in the code.

  ```tsx
  type Result<T, E> = Ok<T, E> | Err<T, E>;
  ```

  The result monad provides a more predictable and structured approach to error handling, which can improve the reliability, readability, performance, and composability of code.

  [⬆️  Back to top](#toc)

### **Basic usage**

  Let’s start with an example of how you might use exceptions in Typescript.

  ```tsx
  function divide(numerator: number, denominator: number): number {
    if (denominator === 0) {
      throw new Error("Division by zero");
    }
    return numerator / denominator;
  }

  const addOne = (x: number): number => x + 1;

  function compute(numerator: number, denominator: number): number {
    try {
      let result = divide(numerator, denominator);
      result = addOne(result);
      return result;
    } catch (error) {
      return 0;
    }
  }

  console.log(compute(10, 2)); // 6
  console.log(compute(10, 0)); // 0
  ```

  In this example, the **`divide`** function throws an exception if the denominator is zero, and the **`compute`** function uses a try-catch block to handle the exception and return zero if it occurs.

  Let rewrite this with a declarative style using flow-ts result monad

  ```tsx

  import { Result, Ok, Err, match } from 'flow-ts';

  function divide(numerator: number, denominator: number): Result<number, string> {
    if (denominator === 0) {
      return Err("Division by zero");
    }
    return Ok(numerator / denominator);
  }

  const addOne = (x: number): Result<number, string> => Ok(x + 1);

  const compute = (numerator: number, denominator: number): number => divide(numerator, denominator).andThen(addOne)

  match(compute(10, 2))({
      Ok: res => console.log(res),
      Err: () => console.log(0),
  }) // 6

  ```

  ```tsx
  match(compute(10, 0))({
      Ok: res => console.log(res),
      Err: () => console.log(0),
  }) // 0
  ```

  In this example, the **`divide`** function returns a result monad representing the result of a division operation. If the denominator is zero, it returns an **`Err`** variant with an error message. If the denominator is non-zero, it returns an **`Ok`** variant holding the result of the division.

  The **`addOne`** function takes a number and returns a result monad representing the result of adding one to that number. In this case, it always returns an **`Ok`** variant.

  `andThen` is used to chain the **`divide`** and **`addOne`** functions together, passing the result of the **`divide`** function as input to the **`addOne`** function. If the **`divide`** function returns an **`Err`** variant, **`andThen`** short-circuits the chain and returns the **`Err`** variant immediately.

  You can also use **`orElse`** to handle any errors that might occur in the computation. If the result monad is an **`Err`** variant, the provided fallback function is called with the error as input and its result is returned.

  ```tsx
  function divide(numerator: number, denominator: number): Result<number, string> {
    if (denominator === 0) {
      return Err("Division by zero");
    }
    return Ok(numerator / denominator);
  }

  const addOne = (x: number): Result<number, string> => Ok(x + 1);

  const compute = (numerator: number, denominator: number): number =>
    divide(numerator, denominator)
      .andThen(addOne)
      .orElse((error: string) => Ok(0))
      .unwrap();

  console.log(compute(10, 2)); // 6
  console.log(compute(10, 0)); // 0
  ```
[⬆️  Back to top](#toc)

### **Benefits**

There are several reasons why you might choose to use the result monad in your code:

1. Improved error handling: The result monad provides a structured way to handle errors and exceptions, allowing for more predictable and easy-to-reason-about code.
2. Improved code readability: By using the result monad, it is clear to anyone reading the code that a computation may or may not be successful, and what to do in each case. This can make the code easier to understand and maintain.
3. Improved code reliability: By using the result monad, it is easier to ensure that errors and exceptions are properly handled and do not result in unexpected behavior or crashes.
4. Improved code composability: The result monad allows for the chaining of operations, similar to the way that the **`Promise`** type in JavaScript allows for the chaining of asynchronous operations. This can make it easier to build up complex computations from simpler ones.

[⬆️  Back to top](#toc)

### **API**

flow-ts Result exposes the following:

- `isOk` returns true if the result is a `Ok` value, false otherwise.
- `isErr` returns true if the option is a `Err` value, false otherwise.
- `ok` transform `Result` type into `Option`type. **`Ok` to `Some` and `Err` to `None`.**
- `err` transform `Result` type into `Option`type. **`Ok` to `None` and `Err` to `Some`.**
- `unwrap` extracts the value held by **`Ok`**, or throws an error if it is **`Err`**
- `unwrapOr` unwraps the value in case of `Ok` or returns the argument value back in case of `Err`.
- `unwrapOrElse` similar to `unwrapOr`. The only difference is, instead of passing a value, you have to pass a closure.
- `unwrapErr` extracts the error held by **`Err`**, or throws an error if it is **`Ok`**
- `expect` similar to `unwrap()` but can accept an argument for setting a custom message for the error.
- `expectErr` extracts the error held by Err, or throws an error if it is Ok
- `andThen` allows for safe chaining of computations, where the result of one computation is passed as input to another computation. I
- `map` allows for the transformation of the value held by  **`Ok`**, leaving **`Err`** unchanged
- `mapErr` allows for the transformation of the error held by **`Er`**, leaving **`Ok`**  unchanged
- `and` when combining two expressions, If both got `Ok`, the value in the second expression returns. If either one got `Err` that value returns immediately.
- `or` when combining two expressions. If either one got `Ok`, that value returns immediately.
- `orElse` allows for the handling of errors, by providing a fallback computation to be used in the case of an error
[⬆️  Back to top](#toc)

### **API Documentation**

  `isOk`

  returns true if the result is a `Ok` value, false otherwise.

  **Example**

  ```tsx
  import { Ok, Err, isOk } from 'flow-ts'

  isOk(Ok(1)) // true
  isOk(Err('error')), // false
  ```

  `isErr`

  returns true if the option is a `Err` value, false otherwise.

  **Example**

  ```tsx
  import { Ok, Err, isErr } from 'flow-ts'

  isErr(Err('error')) // false
  isErr(Ok('not an error')) // true
  ```

  `ok`

  transform `Result` type into `Option`type. **`Ok` to `Some` and `Err` to `None`.**

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts'

  Ok(10).ok() // Some(10)
  Err('message').ok() // None
  ```

  `err`

  transform `Result` type into `Option`type. **`Ok` to `None` and `Err` to `Some`.**

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts'

  Ok(10).err() // None
  Err('message').err() // Some('message')
  ```

  `unwrap`

  extracts the value held by **`Ok`**, or throws an error if it is **`Err`**

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts'

  Ok('car').unwrap() // "car"
  Err('error').unwrap() // fails, throws an Exception
  ```

  `unwrapOr`

  unwraps the value in case of `Ok` or returns the argument value back in case of `Err`.

  **Example**

  ```tsx

  import { Ok, Err } from 'flow-ts'

  Ok("car").unwrapOr("bike") // "car"
  Err('car').unwrapOr("bike") // "bike"
  ```

  `unwrapOrElse`

  similar to `unwrapOr`. The only difference is, instead of passing a value, you have to pass a closure.

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts'

  let fnElse = () => 16;

  Ok(8).unwrap_or_else(fnElse) // 8
  Err('message').unwrap_or_else(() => 'error returned') // 'error returned'
  ```

  `unwrapErr`

  extracts the error held by **`Err`**, or throws an error if it is **`Ok`**

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts'

  Ok(2).unwrapErr() // fails, throws an Exception
  Err('message').unwrapErr() // message
  ```

  `expect`

  similar to `unwrap()` but can accept an argument for setting a custom message for the error.

  **Example**

  ```tsx
  import { Err } from 'flow-ts'

  Err('message').expect("empty value returned"); // ReferenceError: empty value returned
  Ok(true).expect('Not true') // true
  ```

  `expectErr`

  extracts the error held by **`Err`**, or throws an error if it is **`Ok`**

  **Example**

  ```tsx

  import { Ok, Err } from 'flow-ts'

  Err('message').expectErr('error') // message
  Ok('message').expectErr('error') // fails, throw an exception
  ```

  `andThen`

  allows for safe chaining of computations, where the result of one computation is passed as input to another computation.

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts'

  Ok(2).andThen(x => Ok(x * 2)).unwrap() // 4
  Err('message').andThen(e => Ok(e)).unwrapErr() // message
  ```

  `map`

  allows for the transformation of the value held by  **`Ok`**, leaving **`Err`** unchanged

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts'

  Ok(2).map(x => x * 2).map(x => x * x * x).unwrap() // 64
  Err('error').map(e => `map reached ${e}`).unwrapErr() // error
  ```

  `mapErr`

  allows for the transformation of the error held by **`Er`**, leaving **`Ok`**  unchanged

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts'

  Ok('abcde').mapErr(e => `map reached ${e}`).unwrap() // abcde
  Err('error').mapErr(e => `mapErr reached ${e}`).mapErr(e => e.length).unwrapErr() // 20
  ```

  `and` 

  when combining two expressions, If both got `Ok`, the value in the second expression returns. If either one got `Err` that value returns immediately.

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts';

  Ok('ok1').and(Ok('ok2')) // Ok('ok2')
  Ok('ok1').and(Err('error1')) // Err('error1')
  Err('error1').and(Ok('ok1')) // Err('error1')
  Err('error1').and(Err('error2')) // Err('error1')
  ```

  `or` 

  when combining two expressions. If either one got `Ok`, that value returns immediately.

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts';

  Ok('ok1').or(Ok('ok2') // Ok('ok1')
  Ok('ok1')or(Err('error1')) // Ok('ok1')
  Err('error1').or(Ok('ok1')) // Ok('ok1')
  Err('error1').or(Err('error2')) // Err('error2')
  ```

  `orElse` 

  allows for the handling of errors, by providing a fallback computation to be used in the case of an error

  **Example**

  ```tsx
  import { Ok, Err } from 'flow-ts';

  Ok('ok1').orElse(() => Ok('ok2')) // Ok('ok1')
  Ok('ok1').orElse(() => Err('error2')) // Ok('ok1')
  Err('error1').orElse(() => Ok('ok2')) // Ok('ok2')
  Err('error1').orElse(() => Err('error2')) // Err('error2')

  ```
  [⬆️  Back to top](#toc)

## AyncResult<T, E>

### **Introduction**

  `AsyncResult<T,E>` is a type that wraps a Promise of a `Result<T,E>` value. It combines the benefits of both Promise and Result types, making it easier to work with asynchronous operations that can return a success or an error value. AsyncResult provides a simple, composable, and type-safe way to handle errors and success values.

  ```tsx
  type AsyncResult<T, E> = Promise<Result<T, E>> & AsyncResultType<T, E>;
  ```

  [⬆️  Back to top](#toc)

### **Basic usage**

  Let’s start with a pratcial example

  ```tsx
  import axios from 'axios';
  import { AsyncOk, AsyncErr, AsyncResult } from './async-result';

  type APIResponse = {
    numbers: number[];
  };

  type APIError = {
    message: string;
  };

  async function fetchData(): AsyncResult<APIResponse, APIError> {
    try {
      const response = await axios.get<APIResponse>('https://api.example.com/numbers');
      return AsyncOk(response.data);
    } catch (error) {
      return AsyncErr<APIResponse, APIError>({
        message: 'Failed to fetch data from API',
      });
    }
  }

  async function calculateSum(apiResponse: APIResponse): number {
    return apiResponse.numbers.reduce((sum, number) => sum + number, 0);
  }

  async function processDataAndCalculateSum() {
    const asyncResult = await fetchData().andThen(calculateSum);

    const output = match(asyncResult, {
      Ok: (sum: number) => `Sum of numbers: ${sum}`,
      Err: (error: APIError) => `Error: ${error.message}`,
    });

    console.log(output);

    // Another option
    // if (asyncResult.isOk()) {
    //   console.log('Sum of numbers:', asyncResult.unwrap());
    // } else {
    //   console.error('Error:', asyncResult.unwrapErr());
    // }
  }

  processDataAndCalculateSum();
  ```


  ```tsx

  ```
[⬆️  Back to top](#toc)

### **Benefits**

1. Composable: AsyncResult allows you to chain operations and transformations on the success or error values.
2. Type-safe: With TypeScript, you'll get type-checking for both success and error values.
3. Promotes cleaner code: AsyncResult helps you to write more functional and declarative code, reducing the need for explicit error handling and conditionals.

[⬆️  Back to top](#toc)

### **API**

flow-ts Result exposes the following:

- map(fn: (value: T) => A): Transforms the success value using the given function.
- mapErr(fn: (error: E) => A): Transforms the error value using the given function.
- andThen(fn: (value: T) => AsyncResult<A, E>): Chains a new asynchronous operation that depends on the success value.
- then(onfulfilled?: (value: Result<T, E>) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Allows you to use the standard Promise then method, returning a new Promise with the transformed value.

[⬆️  Back to top](#toc)

### **API Documentation**
  `map` 

  Transforms the success value of the AsyncResult using the given function. If the AsyncResult has an Err value, this operation will be a no-op.

  **Example**

  ```tsx
  const asyncResult = AsyncOk<number, string>(3);

  asyncResult.map((value) => value * 2).then((result) => {
    if (result.isOk()) {
      console.log(result.unwrap()); // Output: 6
    }
  });

  ```

  `mapErr` 

  Transforms the error value of the AsyncResult using the given function. If the AsyncResult has an Ok value, this operation will be a no-op.

  **Example**

  ```tsx
  const asyncResult = AsyncErr<number, string>('Error message');

  asyncResult.mapErr((error) => `Transformed: ${error}`).then((result) => {
    if (result.isErr()) {
      console.log(result.unwrapErr()); // Output: Transformed: Error message
    }
  });

  ```

   `andThen` 

  Chains a new asynchronous operation that depends on the success value of the AsyncResult. If the AsyncResult has an Err value, this operation will be a no-op.

  **Example**

  ```tsx
  const asyncResult = AsyncOk<number, string>(3);

  asyncResult.andThen((value) => AsyncOk(value * 2)).then((result) => {
    if (result.isOk()) {
      console.log(result.unwrap()); // Output: 6
    }
  });

  ```

   `then` 

  Allows you to use the standard Promise then method, returning a new Promise with the transformed value. The onfulfilled function will be called with a Result value if the AsyncResult resolves successfully, and the onrejected function will be called with an error if the AsyncResult rejects.

  **Example**

  ```tsx
  const asyncResult = AsyncOk<number, string>(3);

  asyncResult.then(
    (result) => {
      if (result.isOk()) {
        console.log(result.unwrap()); // Output: 3
      }
    },
    (error) => {
      console.error(error);
    }
  );
  ```
  `async/await` 
  Yes, you can await an AsyncResult. Since AsyncResult is a Promise under the hood, you can use it with await within an async function. When you await an AsyncResult, it resolves to a Result<T,E> value, which you can then use with methods like isOk(), isErr(), unwrap(), unwrapErr(), etc.

  ```tsx
  async function example() {
    const asyncResult = AsyncOk<number, string>(3);

    try {
      const result = await asyncResult;

      if (result.isOk()) {
        console.log(result.unwrap()); // Output: 3
      } else {
        console.error(result.unwrapErr());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  ```

## Utils


### Flatten
To remove many levels of nesting:

```tsx
import { Some, None, Ok, Err, flatten } from 'flow-ts'

// with Option
flatten(Some(Some(None))) // None
flatten(Some('some1')) // Some('some1')
flatten(None) // None

// with Result
flatten(Ok(Ok(Ok(Ok(Ok(Ok(Ok(10)))))))) // Ok(10)
flatten(Ok(Ok(Err('error1')))) // Err('error2')
flatten(Ok('ok1')) // Ok('ok1')
flatten(Err('error1')) // Err('error1')
```

### Pattern matching
The `match` function is a generic function that allows handling different cases of `Option` and `Result` types.
It takes an input `t`, which can be either an `Option<T>` or a `Result<T, E>`, and a `matcher` object containing handler functions for each case: `Some`, `None`, `Ok`, and `Err`.

Matching Option:
```tsx
import { Option, Some, None, match } from 'flow-ts';

const getUser = (id: number): Option<User> => Some(users.find(user => user.id === id));

const getUserName = (id: number): Option<string> => getUser(id).map(user => user.username);

match(getUserName(2))({
		Some: username => console.log(username),
	  None: () => console.log("User not found"),
})
```
Matching Result:

  ```tsx

  import { Result, Ok, Err, match } from 'flow-ts';

  function divide(numerator: number, denominator: number): Result<number, string> {
    if (denominator === 0) {
      return Err("Division by zero");
    }
    return Ok(numerator / denominator);
  }

  const addOne = (x: number): Result<number, string> => Ok(x + 1);

  const compute = (numerator: number, denominator: number): number => divide(numerator, denominator).andThen(addOne)

  match(compute(10, 2))({
      Ok: res => console.log(res),
      Err: () => console.log(0),
  }) // 6

  ```

### Equals
The equals function provides a simple and convenient way to compare the equality of two Option or Result instances based on their contents.
 ```tsx
  import { Some, None, Option, Result, Ok, Err, equals } from '../src';

  // Example with Option types
  const someValue1: Option<number> = Some(42);
  const someValue2: Option<number> = Some(42);
  const someValue3: Option<number> = Some(7);
  const noneValue1: Option<number> = None;

  console.log(equals(someValue1, someValue2)); // true
  console.log(equals(someValue1, someValue3)); // false
  console.log(equals(someValue1, noneValue1)); // false

  // Example with Result types
  const okValue1: Result<number, string> = Ok(42);
  const okValue2: Result<number, string> = Ok(42);
  const okValue3: Result<number, string> = Ok(7);
  const errValue1: Result<number, string> = Err('Error message');
  const errValue2: Result<number, string> = Err('Error message');
  const errValue3: Result<number, string> = Err('Different error message');

  console.log(equals(okValue1, okValue2)); // true
  console.log(equals(okValue1, okValue3)); // false
  console.log(equals(okValue1, errValue1)); // false
  console.log(equals(errValue1, errValue2)); // true
  console.log(equals(errValue1, errValue3)); // false
 ```
[⬆️  Back to top](#toc)

If you find this package useful, please click the star button ✨!
