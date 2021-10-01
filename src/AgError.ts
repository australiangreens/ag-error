import { getClassChainOf } from './helpers';

// We want to make use of the pattern of Error objects, where the name of each
// instance corresponds to the class. The simplest approach would be to just
// define a name property on each object instance. However this causes
// complications with the hierarchicalName() getter. Instead we want to have
// a static property on the class itself. We can't rely on the class name as
// defined in our source code, since it might be minified or changed in some
// other way.
//
// Therefore, we do two things:
// 1. Every class has to define static errorName = '....';
// 2. Have this class, which all of our errors inherit from, define a getter
//    that fetches the name of _the child class_.
//
// Relevant reading:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
// https://2ality.com/2011/06/constructor-property.html
// https://stackoverflow.com/questions/17169335/how-do-i-specify-constructor-name-on-a-custom-object
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
// https://github.com/microsoft/TypeScript/issues/442
// https://github.com/microsoft/TypeScript/pull/12065
// https://github.com/Microsoft/TypeScript/issues/3841

export class AgError extends Error {
  // When we talk about 'class' it's just syntatic sugar and we really mean the
  // prototype's constructor function, which, because functions in JS are
  // first-class object, can have properties added to it. By default it will
  // have a name property set to the classname, but we don't want to rely on
  // that (see below)
  constructor(message = 'Unknown error') {
    super(message);

    // Maintains proper stack trace for where our error was thrown (only
    // available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // We set a static property that matches the class/file name, so that it is
  // the  same value even if the code is minified. We have to do this for every
  // class that extends this.
  // If we attempted to call our static property 'name', it will conflict with
  // with the built-in property 'Function.name' of the constructor function.
  // This causes a very specific typescript error that is handled by
  // https://github.com/microsoft/TypeScript/pull/12065, so it not a good idea.
  // Instead we just use our own property
  public static errorName = 'AgError';

  // We add a (non-static) getter that will be inherited by all children. It
  // will fetch the errorName property of the object representing the class (i.e
  // the constructor function, which is itself an object).
  get name() {
    // Attempting to access this.constructor.errorName will result in a
    // typescript error:
    // "Property 'errorName' does not exist on type 'Function'.ts(2339)"
    //
    // We can't properly declare that all subclasses have a static errorName
    // property due to a (longterm) outstanding issue:
    // https://github.com/Microsoft/TypeScript/issues/3841
    //
    // Unfortunately the solution that minimises code repetition is to suppress
    // the error

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Property 'errorName' does not exist on type 'Function'
    return this.constructor.errorName;
  }

  /**
   * The name of this error and name of all of it superclasses
   * separated by ':', starting with AgError.
   *
   * @example
   * // If Foo extends AgError and Bar extends Foo (and both correctly
   * // set their static name property), then:
   * const b = new Bar();
   * b.hierarchicalName === 'AgError:Foo:Bar'; // true
   *
   * @returns A class chain for the error
   */
  get hierarchicalName() {
    // We don't include Error, not just because it makes it longer than we want,
    // but because if minified Error's name might be different
    return getClassChainOf(this, { stopAfter: (x: typeof AgError) => x === AgError })
      .map((x) => x?.errorName ?? '???')
      .reverse()
      .join(':');
  }
}
