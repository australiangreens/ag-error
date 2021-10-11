# ag-error

Provides an AgError class to be used as part of a consistent error pattern
across AG's backend and frontend js/ts apps.

Specifically, exposes `name` getter which will be informative regardless of code
minification or other renaming and `hierachical` getter which will be the full
class path starting at AgError. For example
"AgError:SomeBaseAppError:FooApiError".

## Installation

**TODO**
*This is a library/set of modules we re-use across our apps. It is a good*
*candidate to put into a private repo, or rename and make into a public repo.*
*For the momement however it is just copied between projects*

TODO: This is also why the dist directory is included in the repository, but
using a postinstall script would be a better option

## Usage

Define your errors as extending the AgError superclass, with the requirement
that they all have a static `errorName` property that matches the class name
and filename.

For example

```ts
// In SomeAppError.ts
import { AgError } from '../path/to/lib/ag-error';

export class SomeBaseAppError extends AgError {
  static errorName = 'SomeBaseAppError';
}

// In FooApiError.ts
import { SomeBaseAppError } from './SomeBaseAppError';

export class FooApiError extends SomeBaseAppError {
  static errorName = 'FooApiError';
}
```

Then

```ts
import { SomeBaseAppError } from '../SomeBaseAppError';
import { FooApiError } from '../FooApiError';

const err1 = new SomeBaseAppError('Something bad');
const err2 = new FooApiError('Also bad');

console.log(err1.name); // => 'SomeBaseAppError'
console.log(err2.name); // => 'FooApiError'

console.log(err1.hierachicalName); // => 'AgError:SomeBaseAppError'
console.log(err1.hierachicalName); // => 'AgError:SomeBaseAppError:FooApiError'
```

This is useful when catching errors and using their name and hierachical name
in error logs and in error messages/objects communicated between the API of
different apps.

### Extra data

Can have a subclass with extra data attached. This should be added as 2nd, 3rd
etc arguments after the message. The first argument should always be maintained
as an optional message (doesn't matter what the default is).

Note that if you add extra arguments, you will not be able use the custom
`toBeValidAgErrorClass()` jest matcher (below).

## Testing

*If using jest and just want to get it working, skip to [the next section](#ag-error-jest)*

Ideally you should have unit tests for each subclass of AgError, confirming
that:

1. Objects of the class have the expected value for their name;
2. Object of the class have the expected value for their hierarchicalName;
3. The value of name is not dependent on the source class (i.e constructor.name)
   The motivation for the final requirement is to ensure the error information
   will work even if the code is minified or obsfucated.

The tests are primarily to just to mitigate the chance of typos. You may find
them redundant depending on your workflow.

### ag-error-jest

To make testing simpler, if using [jest](https://jestjs.io/), a custom matcher
called `toBeValidAgErrorClass()` is by the related `ag-error-jest`. This will do
all the tests nececesary in one go, and is what `ag-error` uses internally.

#### Installing ag-error-jest

At time of writing we are using private git repositories, not npm

#### Setup of ag-error-jest

Making use of the package once installs works in the same way as
[jest-extended](https://github.com/jest-community/jest-extended), relying on
side-effects. Add `@australiangreens/ag-error-jest` to your jest
`setupFilesAfterEnv` configuration property. See [the jest
docs](https://jestjs.io/docs/configuration) for details

For example in `jest.config.js`:

```js
export default {
  //...
  "setupFilesAfterEnv": ["@australiangreens/ag-error-jest"],
  //...
}
```

Alternatively if you already have a `./src/setupTests.ts` in your
`setupFilesAfterEnv`, then you and add an import into that intead:

```ts
import '@australiangreens/ag-error-jest';
```

#### Using ag-error-jest

So your test files for each error only needs to be something like:

```ts
import { BoilerplateError } from './BoilerplateError';

test('BoilerplateError meets requirements to be a valid AgError', () => {
  expect(BoilerplateError).toBeValidAgErrorClass(
    'BoilerplateError',
    'AgError:BoilerplateError',
  );
});
```

### Caveat: Different constructor signature

If you add extra arguments to the constructor, the `toBeValidAgErrorClass()`
matcher may not work. In this case you should should be able to use
`toBeValidAgErrorObject()` which checks the first two requirements, but will
need to manually test the first.

The following example shows a test for a special CiviApiAxiosError error that is
a wrapper for axios related errors.

```ts
import { CiviApiAxiosError } from './CiviApiAxiosError';
import { createAxiosError } from '../../../utils/testing';

test('CiviApiAxiosError meets requirements to be a valid AgError', () => {
  const err = new CiviApiAxiosError('some message', createAxiosError('Network Error', {}, null, {}, null));
  expect(err).toBeValidAgErrorObject('CiviApiAxiosError', 'AgError:BoilerplateError:CiviApiError:CiviApiAxiosError');

  // This is the bit we have to do manually.
  // Not a normal sort of test, but basically want to ensure the way we've done
  // this doesn't actually end up using the class name even if minified. We can
  // (sort of) emulate this by deliberately breaking our own rules using a name
  // that does not match the class to make sure the correct one is being used.
  class DummySubClass extends CiviApiAxiosError {
    static errorName = 'NotTheSame';
  }
  const dummy = new DummySubClass('some message', createAxiosError('Network Error', {}, null, {}, null));

  expect(dummy.name).not.toEqual(dummy.constructor.name);
});
```

## FAQ

### Why not just use `constructor.name`?

If AgError simply had `this.name = this.constructor.name;` in its constructor,
there would be no need to separately define errorName for every class. However
that can't be relied on if any sort of build process is used that might change
class names (e.g. minifying the code).

You can still use (and are encouraged to use) `instanceof` to check the actual
class, rather than the name or hierachicalName. The motivation for the names
is purely logging and debugging.

### Why not use `static name = '...'` property?

This results in typescript error TS2699. We could use `@ts-ignore` however the
conversation in [this issue](https://github.com/microsoft/TypeScript/issues/442)
indicates this is a Bad Idea and there ended up being a
[PR](https://github.com/microsoft/TypeScript/pull/12065) raised specifically to
cause this error - it is very much intended

### Why not just use (non-static) `name = '...'` property?

This is not feasible because it will prevent the `hierarchicalName()` getter
method from working as intended - it would have to call a non-static method on
each class, necessitating a dummy object in every ‘layer’. This by itself would
be fine, but would mean all constructors of subclasses would have to guarantee
all arguments be optional, which isn’t possible to enforce.

It was simpler just to have a static property (i.e property on the constructor)
called `errorName`. Then we have a simple name getter that just returns
`this.constructor.errorName` and make use of this in the hierarchalName getter
too.

Admittedly this does still result in a typescript error about errorName not
existing on the constructor, despite it clearly being there, due to an
[issue](https://github.com/Microsoft/TypeScript/issues/3841) that has been open
since 2015, whose workarounds don't help us. It doesn't look like a simple issue
to fix. So in this case we do actually use `@ts-ignore` knowing the for certain
exact the constructor does in fact have the property in question.

## About the build process

Originally the plan was to only compile with ESM as the target, since that is
what we are using across all our apps. However due to Jest not yet properly
handling ESM, we need to provide the commonjs files too.

To achive this, we use the hybrid module pattern described here:
<https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html>

We make a few changes however:

- For the directory in dist we use "esm" instead of "mjs"
- Rather than using a separate `tsconfig-base.json`, just `tsconfig.json` contain the ESM definition and have `tsconfig-cjs.son` extend and override it.
- In `tsconfig-cjs.json`, add `declaration": false`.

The reasoning for last point is that we don't need the declaration files in both places; they are basically just for editor hinting. [the handbook](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html) states  "The .d.ts syntax intentionally looks like ES Modules syntax", so it makes more sense to put the declarations in the esm directory.
