export declare class AgError extends Error {
    constructor(message?: string);
    static errorName: string;
    get name(): any;
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
    get hierarchicalName(): string;
}
