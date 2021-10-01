/**
 * Fetch the prototype of object and that prototype's prototype and so on
 * until either null is reached (it isn't included by default) or stopBefore
 * callback returns true.
 *
 *
 * @param obj - The object to get the prototype chain of
 * @param options - options to pass in
 *
 * @returns an array of prototype objects
 */
export declare function getPrototypeChainOf(obj: unknown, options?: {}): any[];
/**
 * Fetch the class of object, that class's superclass and so on until hitting
 * the class that does not extend a class, or stopBefore callback returns true.
 *
 * NOTE #1: A class is just syntactic sugar and basically means the constructor
 * function of an object's prototype. Abstracting the language into classes and
 * such can be helpful though.
 *
 * NOTE #2: The obj is an instance of a class, not a class itself.
 *
 * @param obj - The object to get the prototype chain of
 * @param options - options to pass in
 *
 * @returns An array of constructor functions treated the same way of classes.
 */
export declare function getClassChainOf(obj: unknown, options?: {}): any[];
