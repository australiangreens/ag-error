/* eslint-disable max-classes-per-file */
// UNITS TESTS

import { getPrototypeChainOf, getClassChainOf } from './helpers';

//             null (ignored by default)
//              ┃
//            Object
//              ┃
//              A
//              ┃
//              B
//           ┏━━┻━━┓
//           C     D
//                 ┃
//                 E

// Expected chain: [A, Object]
class A {
//  static name = 'A';
}

// Expected chain: [B, A, Object]
class B extends A {
//  static name = 'B';

  someOtherField = 'hi I am another field';
}

// Expected chain: [C, B, A, Object]
class C extends B {
//  static name = 'C';
}

// Expected chain: [D, B, A, Object]
class D extends B {
//  static name = 'D';
}

// Expectd chain: [E, D, B, A, Object]
class E extends D {
//  static name = 'E';
}

describe('getPrototypeChainOf()', () => {
  describe('with default options', () => {
    it('returns [] when passed null or undefined', () => {
      expect(getPrototypeChainOf(null)).toEqual([]);
      expect(getPrototypeChainOf(undefined)).toEqual([]);
    });

    it('returns prototypes of [A, Object] when passed object whose class A has no extend beyond default', () => {
      const a = new A();
      const chain = getPrototypeChainOf(a);

      expect(chain).toBeArrayOfSize(2);
      expect(chain[0]).toEqual(A.prototype);
      expect(chain[1]).toEqual(Object.prototype);
    });

    it('returns prototypes of [B, A, Object] when passed object whose class B extends A->Object', () => {
      const b = new B();
      const chain = getPrototypeChainOf(b);

      expect(chain).toBeArrayOfSize(3);
      expect(chain[0]).toEqual(B.prototype);
      expect(chain[1]).toEqual(A.prototype);
      expect(chain[2]).toEqual(Object.prototype);
    });

    it('returns prototypes of [C, B, A, Object] when passed object whose class C extends B->A->Object', () => {
      const c = new C();
      const chain = getPrototypeChainOf(c);

      expect(chain).toBeArrayOfSize(4);
      expect(chain[0]).toEqual(C.prototype);
      expect(chain[1]).toEqual(B.prototype);
      expect(chain[2]).toEqual(A.prototype);
      expect(chain[3]).toEqual(Object.prototype);
    });

    it('returns prototypes of [D, B, A, Object] when passed object whose class D extends B->A->Object', () => {
      const d = new D();
      const chain = getPrototypeChainOf(d);

      expect(chain).toBeArrayOfSize(4);
      expect(chain[0]).toEqual(D.prototype);
      expect(chain[1]).toEqual(B.prototype);
      expect(chain[2]).toEqual(A.prototype);
      expect(chain[3]).toEqual(Object.prototype);
    });

    it('returns prototypes of [E, D, B, A, Object] when passed object whose class E extends D->B->A->Object', () => {
      const e = new E();
      const chain = getPrototypeChainOf(e);

      expect(chain).toBeArrayOfSize(5);
      expect(chain[0]).toEqual(E.prototype);
      expect(chain[1]).toEqual(D.prototype);
      expect(chain[2]).toEqual(B.prototype);
      expect(chain[3]).toEqual(A.prototype);
      expect(chain[4]).toEqual(Object.prototype);
    });
  });

  describe('with includeNull=true', () => {
    const options = {
      includeNull: true,
    };

    it('returns [null] when passed null', () => {
      expect(getPrototypeChainOf(null, options)).toEqual([null]);
    });

    it('returns [] when passed undefined', () => {
      expect(getPrototypeChainOf(undefined, options)).toEqual([]);
    });

    it('returns prototypes of [A, Object, null] when passed object whose class A has no extend beyond default', () => {
      const a = new A();
      const chain = getPrototypeChainOf(a, options);

      expect(chain).toBeArrayOfSize(3);
      expect(chain[0]).toEqual(A.prototype);
      expect(chain[1]).toEqual(Object.prototype);
      expect(chain[2]).toBeNull();
    });

    it('returns prototypes of [B, A, Object, null] when passed object whose class B extends A->Object', () => {
      const b = new B();
      const chain = getPrototypeChainOf(b, options);

      expect(chain).toBeArrayOfSize(4);
      expect(chain[0]).toEqual(B.prototype);
      expect(chain[1]).toEqual(A.prototype);
      expect(chain[2]).toEqual(Object.prototype);
      expect(chain[3]).toBeNull();
    });
  });

  describe('with stopAfter = (x) => x === B.prototype', () => {
    const options = {
      stopAfter: (x: unknown) => x === B.prototype,
    };

    it('returns [] when passed null or undefined', () => {
      expect(getPrototypeChainOf(null, options)).toEqual([]);
      expect(getPrototypeChainOf(undefined, options)).toEqual([]);
    });

    it('returns prototypes of [A, Object] when passed object whose class A has no extend beyond default', () => {
      const a = new A();
      const chain = getPrototypeChainOf(a, options);

      expect(chain).toBeArrayOfSize(2);
      expect(chain[0]).toEqual(A.prototype);
      expect(chain[1]).toEqual(Object.prototype);
    });

    it('returns prototypes of [B] when passed object whose class B extends A->Object', () => {
      const b = new B();
      const chain = getPrototypeChainOf(b, options);

      expect(chain).toBeArrayOfSize(1);
      expect(chain[0]).toEqual(B.prototype);
    });

    it('returns prototypes of [C, B] when passed object whose class C extends B->A->Object', () => {
      const c = new C();
      const chain = getPrototypeChainOf(c, options);

      expect(chain).toBeArrayOfSize(2);
      expect(chain[0]).toEqual(C.prototype);
      expect(chain[1]).toEqual(B.prototype);
    });

    it('returns prototypes of [E, D, B] when passed object whose class E extends E->D->B->A->Object', () => {
      const e = new E();
      const chain = getPrototypeChainOf(e, options);

      expect(chain).toBeArrayOfSize(3);
      expect(chain[0]).toEqual(E.prototype);
      expect(chain[1]).toEqual(D.prototype);
      expect(chain[2]).toEqual(B.prototype);
    });
  });

  describe('with stopBefore = (x) => x === B.prototype', () => {
    const options = {
      stopBefore: (x: unknown) => x === B.prototype,
    };

    it('returns [] when passed null or undefined', () => {
      expect(getPrototypeChainOf(null, options)).toEqual([]);
      expect(getPrototypeChainOf(undefined, options)).toEqual([]);
    });

    it('returns prototypes of [A, Object] when passed object whose class A has no extend beyond default', () => {
      const a = new A();
      const chain = getPrototypeChainOf(a, options);

      expect(chain).toBeArrayOfSize(2);
      expect(chain[0]).toEqual(A.prototype);
      expect(chain[1]).toEqual(Object.prototype);
    });

    it('returns prototypes of [] when passed object whose class B extends A->Object', () => {
      const b = new B();
      const chain = getPrototypeChainOf(b, options);

      expect(chain).toEqual([]);
    });

    it('returns prototypes of [C] when passed object whose class C extends B->A->Object', () => {
      const c = new C();
      const chain = getPrototypeChainOf(c, options);

      expect(chain).toBeArrayOfSize(1);
      expect(chain[0]).toEqual(C.prototype);
    });

    it('returns prototypes of [E, D] when passed object whose class E extends E->D->B->A->Object', () => {
      const e = new E();
      const chain = getPrototypeChainOf(e, options);

      expect(chain).toBeArrayOfSize(2);
      expect(chain[0]).toEqual(E.prototype);
      expect(chain[1]).toEqual(D.prototype);
    });
  });
});

describe('getClassChainOf()', () => {
  describe('with default options', () => {
    it('returns [] when passed null or undefined', () => {
      expect(getClassChainOf(null)).toEqual([]);
      expect(getClassChainOf(undefined)).toEqual([]);
    });

    it('returns [A, Object] when passed object whose class A has no extend beyond default', () => {
      const a = new A();
      const chain = getClassChainOf(a);

      expect(chain).toBeArrayOfSize(2);
      expect(chain[0]).toEqual(A);
      expect(chain[1]).toEqual(Object);
    });

    it('returns [B, A, Object] when passed object whose class B extends A->Object', () => {
      const b = new B();
      const chain = getClassChainOf(b);

      expect(chain).toBeArrayOfSize(3);
      expect(chain[0]).toEqual(B);
      expect(chain[1]).toEqual(A);
      expect(chain[2]).toEqual(Object);
    });

    it('returns [C, B, A, Object] when passed object whose class C extends B->A->Object', () => {
      const c = new C();
      const chain = getClassChainOf(c);

      expect(chain).toBeArrayOfSize(4);
      expect(chain[0]).toEqual(C);
      expect(chain[1]).toEqual(B);
      expect(chain[2]).toEqual(A);
      expect(chain[3]).toEqual(Object);
    });

    it('returns [D, B, A, Object] when passed object whose class D extends B->A->Object', () => {
      const d = new D();
      const chain = getClassChainOf(d);

      expect(chain).toBeArrayOfSize(4);
      expect(chain[0]).toEqual(D);
      expect(chain[1]).toEqual(B);
      expect(chain[2]).toEqual(A);
      expect(chain[3]).toEqual(Object);
    });

    it('returns [E, D, B, A, Object] when passed object whose class E extends D->B->A->Object', () => {
      const e = new E();
      const chain = getClassChainOf(e);

      expect(chain).toBeArrayOfSize(5);
      expect(chain[0]).toEqual(E);
      expect(chain[1]).toEqual(D);
      expect(chain[2]).toEqual(B);
      expect(chain[3]).toEqual(A);
      expect(chain[4]).toEqual(Object);
    });
  });

  describe('with stopAfter = (x) => x === B', () => {
    const options = {
      stopAfter: (x: unknown) => x === B,
    };

    it('returns [] when passed null or undefined', () => {
      expect(getClassChainOf(null, options)).toEqual([]);
      expect(getClassChainOf(undefined, options)).toEqual([]);
    });

    it('returns [A, Object] when passed object whose class A has no extend beyond default', () => {
      const a = new A();
      const chain = getClassChainOf(a, options);

      expect(chain).toBeArrayOfSize(2);
      expect(chain[0]).toEqual(A);
      expect(chain[1]).toEqual(Object);
    });

    it('returns [B] when passed object whose class B extends A->Object', () => {
      const b = new B();
      const chain = getClassChainOf(b, options);

      expect(chain).toBeArrayOfSize(1);
      expect(chain[0]).toEqual(B);
    });

    it('returns [C, B] when passed object whose class C extends B->A->Object', () => {
      const c = new C();
      const chain = getClassChainOf(c, options);

      expect(chain).toBeArrayOfSize(2);
      expect(chain[0]).toEqual(C);
      expect(chain[1]).toEqual(B);
    });

    it('returns [E, D, B] when passed object whose class E extends D->B->A->Object', () => {
      const e = new E();
      const chain = getClassChainOf(e, options);

      expect(chain).toBeArrayOfSize(3);
      expect(chain[0]).toEqual(E);
      expect(chain[1]).toEqual(D);
      expect(chain[2]).toEqual(B);
    });
  });

  describe('with stopBefore = (x) => x === B', () => {
    const options = {
      stopBefore: (x: unknown) => x === B,
    };

    it('returns [] when passed null or undefined', () => {
      expect(getClassChainOf(null, options)).toEqual([]);
      expect(getClassChainOf(undefined, options)).toEqual([]);
    });

    it('returns [A, Object] when passed object whose class A has no extend beyond default', () => {
      const a = new A();
      const chain = getClassChainOf(a, options);

      expect(chain).toBeArrayOfSize(2);
      expect(chain[0]).toEqual(A);
      expect(chain[1]).toEqual(Object);
    });

    it('returns [] when passed object whose class B extends A->Object', () => {
      const b = new B();
      const chain = getClassChainOf(b, options);

      expect(chain).toEqual([]);
    });

    it('returns [C] when passed object whose class C extends B->A->Object', () => {
      const c = new C();
      const chain = getClassChainOf(c, options);

      expect(chain).toBeArrayOfSize(1);
      expect(chain[0]).toEqual(C);
    });

    it('returns [E, D] when passed object whose class E extends D->B->A->Object', () => {
      const e = new E();
      const chain = getClassChainOf(e, options);

      expect(chain).toBeArrayOfSize(2);
      expect(chain[0]).toEqual(E);
      expect(chain[1]).toEqual(D);
    });
  });
});
