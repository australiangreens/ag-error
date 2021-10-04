const DEFAULT_GET_PROTOTYPE_CHAIN_OF_OPTIONS = {
    includeNull: false,
    stopBefore: undefined,
    stopAfter: undefined,
};
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
export function getPrototypeChainOf(obj, options = {}) {
    const opts = Object.assign(Object.assign({}, DEFAULT_GET_PROTOTYPE_CHAIN_OF_OPTIONS), options);
    if (!obj) {
        if (obj === null && opts.includeNull)
            return [null];
        return [];
    }
    // We want the first thing added to the chain to be obj's prototype, not obj
    // itself
    const prototypeChain = [];
    let nextPrototype = Object.getPrototypeOf(obj);
    do {
        if (opts.stopBefore && opts.stopBefore(nextPrototype))
            break;
        prototypeChain.push(nextPrototype);
        if (opts.stopAfter && opts.stopAfter(nextPrototype))
            break;
        nextPrototype = Object.getPrototypeOf(nextPrototype);
    } while (nextPrototype);
    // Due to the way we've implemented this, we actually need to explicitly add it
    // when requested rather than remove it when not
    if (opts.includeNull)
        prototypeChain.push(null);
    return prototypeChain;
}
const DEFAULT_GET_CLASS_CHAIN_OF_OPTIONS = {
    stopBefore: undefined,
    stopAfter: undefined,
};
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
export function getClassChainOf(obj, options = {}) {
    const opts = Object.assign(Object.assign({}, DEFAULT_GET_CLASS_CHAIN_OF_OPTIONS), options);
    // Since an object's class is just the constructor of it's prototype, we can
    // just re-use getPrototypeChainOf and wrap the stopping functions
    delete opts.includeNull;
    if (opts.stopBefore) {
        const oldStopBefore = Object.assign(opts.stopBefore);
        opts.stopBefore = (x) => oldStopBefore(x.constructor);
    }
    if (opts.stopAfter) {
        const oldStopAfter = Object.assign(opts.stopAfter);
        opts.stopAfter = (x) => oldStopAfter(x.constructor);
    }
    const prototypeChain = getPrototypeChainOf(obj, opts);
    return prototypeChain.map((x) => x.constructor);
}
//# sourceMappingURL=helpers.js.map