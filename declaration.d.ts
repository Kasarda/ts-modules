/**
 *
 * JSX
 *
 */

declare namespace JSX {
  interface IntrinsicElements {
    "router-link": any
  }
}

/**
 *
 * Modules
 *
 */

declare module '*'


/**
 *
 * Mocha Testing
 *
 */

declare const describe: {
  (testDescription: string, f: Function): any
  only(testDescription: string, f: Function): any
  skip(testDescription: string, f: Function): any
}

declare const it: {
  (testDescription: string, f?: Function, done?: Function): any
  only(testDescription: string, f?: Function, done?: Function): any
  skip(testDescription: string, f?: Function, done?: Function): any
}

declare function before(f: Function, done?: Function): any
declare function after(f: Function, done?: Function): any
declare function beforeEach(f: Function, done?: Function): any
declare function afterEach(f: Function, done?: Function): any
declare const run: Function


/**
 *
 * Others
 *
 */

interface NodeList {
  forEach(val?: any, index?: number, obj?: any): void
}