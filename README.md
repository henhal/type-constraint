# type-constraint
A helper for declaring TypeScript literals so that they conform to a type constraint but are still inferred to their specific type.

## Installation

Using NPM:
```
$ npm install type-constraint
```

Using Yarn
```
$ yarn add type-constraint
```

## Usage

Sometimes it's useful to infer the type of an object literal, while still having the literal conform to a type constraint.

Example:

Consider this `Api` interface
```
type Handler<T> = (params: any) => T;

interface Api {
  greet: Handler<string>;
  cat: Handler<string>
  ultimateQuestion: Handler<number>;
}
```

If an interface like this (but typically much larger) is being implemented in parts, there is no built-in way of defining partial implementations in different objects, while making sure each part conforms to its share of the interface, and also ensuring the combined parts make out the complete, correct interface.

### Without `type-constraint`

Inferring parts: :x:
```
const subImpl1 = {
  greet: () => 'Hello, world!',
  cat: () => 'Meow!',
} // type is inferred but not type checked against Api

const subImpl2 = {
  ultimateQuestion: () => 42
} // type is inferred but not type checked against Api

const impl: Api = {...subImpl1, ...subImpl2}; // combined implementation is type checked against Api
```

Using `Partial`: :x:

```
const subImpl1: Partial<Api> = {
  greet: () => 'Hello, world!',
  cat: () => 'Meow!',
} // typed as Partial<Api>, we lose track of _which_ part is implemented by this object

const subImpl2: Partial<Api> = {
  ultimateQuestion: () => 42
} // typed as Partial<Api>, we lose track of _which_ part is implemented by this object

const impl: Api = {...subImpl1, ...subImpl2}; // Does not compile since the compiler does not know that subImpl1 & subImpl2 makes out the complete interface.
```

### With `type-constraint`

```
import Constraint from 'type-constraint';

const api = Constraint.of<Api>();

const subImpl1 = api.pick({
  greet: () => 'Hello, world!',
  cat: () => 'Meow!',
}); // Type is inferred as Pick<Api, 'greet' | 'cat'> while the literal is still type-checked against Api :+1:

const subImpl2 = api.pick({
  ultimateQuestion: () => 42
}); // Type is inferred as Pick<Api, 'ultimateQuestion'> while the literal is still type-checked against Api :+1:

const impl: Api = {...subImpl1, ...subImpl2}; // subImpl1 & subImpl2 makes out the complete interface! :+1:
```

Both requirements are fulfilled! :+1:

* Sub-parts are type-checked against full interface :white_check_mark:
* Sub-parts have their type inferred to the specific part of the full interface :white_check_mark:
* Combined sub-parts are type-checked to make out the full interface :white_check_mark:


Examples of errors found in compile time using `type-constraint`:

1. Incorrectly implemented method (wrong return type)
```
const subImpl1 = api.pick({
  greet: () => 42, // Error: Type number is not assignable to string
  cat: () => 'Meow!',
});
```

2. Spelled method incorrectly:

```
const subImpl2 = api.pick({
  ultimateQestion: () => 42 // Error: Object literal may only specify known properties, but ultimateQestion does not exist in Pick<Api, keyof Api>. Did you mean to write ultimateQuestion?
});
```
