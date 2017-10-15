/**
 * 
 * @module {animation}
 * 
 * Includes animejs refference
 * and timing functions
 */

import * as Animation from 'animejs'
export { Animation }

import { error } from './common'




/**
  *
  * {bezier}
  * Bezier timing function
  * bezier( a b c d ) (progress)
  *
*/


const NEWTON_ITERATIONS = 4
const NEWTON_MIN_SLOPE = 0.001
const SUBDIVISION_PRECISION = 0.0000001
const SUBDIVISION_MAX_ITERATIONS = 10

let kSplineTableSize = 11
let kSampleStepSize = 1.0 / (kSplineTableSize - 1.0)

let float32ArraySupported = typeof Float32Array === 'function'

const A: (aA1: number, aA2: number) => number = (aA1, aA2) => 1.0 - 3.0 * aA2 + 3.0 * aA1
const B: (aA1: number, aA2: number) => number = (aA1, aA2) => 3.0 * aA2 - 6.0 * aA1
const C: (aA1: number) => number = (aA1) => 3.0 * aA1
const calcBezier: (aT: number, aA1: number, aA2: number) => number = (aT, aA1, aA2) => ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT
const getSlope: (aT: number, aA1: number, aA2: number) => number = (aT, aA1, aA2) => 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1)

function binarySubdivide(aX: number, aA: number, aB: number, mX1: number, mX2: number): number {
  let currentX: number, currentT: number, i: number = 0
  do {
    currentT = aA + (aB - aA) / 2.0
    currentX = calcBezier(currentT, mX1, mX2) - aX
    if (currentX > 0.0) {
      aB = currentT
    } else {
      aA = currentT
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS)
  return currentT
}

function newtonRaphsonIterate(aX: number, aGuessT: number, mX1: number, mX2: number): number {
  for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
    let currentSlope: number = getSlope(aGuessT, mX1, mX2)
    if (currentSlope === 0.0) {
      return aGuessT
    }
    let currentX: number = calcBezier(aGuessT, mX1, mX2) - aX
    aGuessT -= currentX / currentSlope
  }
  return aGuessT
}



export function bezier(mX1: number, mY1: number, mX2: number, mY2: number): any {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1))
    error('bezier x values must be in [0, 1] range')

  let sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize)
  if (mX1 !== mY1 || mX2 !== mY2) {
    for (let i = 0; i < kSplineTableSize; ++i)
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2)

  }

  function getTForX(aX: number): number {
    let intervalStart = 0.0
    let currentSample = 1
    let lastSample = kSplineTableSize - 1

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample)
      intervalStart += kSampleStepSize

    --currentSample

    let dist: number = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample])
    let guessForT: number = intervalStart + dist * kSampleStepSize

    let initialSlope: number = getSlope(guessForT, mX1, mX2)
    if (initialSlope >= NEWTON_MIN_SLOPE)
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2)
    else if (initialSlope === 0.0)
      return guessForT
    else
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2)

  }

  return function BezierEasing(x: number): number {
    if (mX1 === mY1 && mX2 === mY2)
      return x // linear

    if (x === 0)
      return 0

    if (x === 1)
      return 1

    return calcBezier(getTForX(x), mY1, mY2)
  }
}





/**
  *
  * {steps}
  * Steps timing function
  * steps( steps ) (progress)
  *
*/
export function steps(steps: number): (progress: number) => number {
  return progress => Math.round(progress * steps) * (1 / steps)
}




/**
  *
  * {spring}
  * Spring physics timing function
  * spring(tension friction  duration ) (progress)
  *
*/
export const spring = (function () {
  const springAccelerationForState = (state: any) => (-state.tension * state.x) - (state.friction * state.v)

  function springEvaluateStateWithDerivative(initialState: any, dt: any, derivative: any): any {
    const state: any = {
      x: initialState.x + derivative.dx * dt,
      v: initialState.v + derivative.dv * dt,
      tension: initialState.tension,
      friction: initialState.friction
    }

    return { dx: state.v, dv: springAccelerationForState(state) }
  }

  function springIntegrateState(state: any, dt: any): any {
    const a: any = {
      dx: state.v,
      dv: springAccelerationForState(state)
    },
      b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
      c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
      d = springEvaluateStateWithDerivative(state, dt, c),
      dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
      dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv)

    state.x = state.x + dxdt * dt
    state.v = state.v + dvdt * dt

    return state
  }

  return function springRK4Factory(tension: any, friction: any, duration?: any): any {

    let initState: any = {
      x: -1,
      v: 0,
      tension: null,
      friction: null
    },
      path = [0],
      time_lapsed = 0,
      tolerance = 1 / 10000,
      DT = 16 / 1000,
      have_duration, dt, last_state

    tension = parseFloat(tension) || 500
    friction = parseFloat(friction) || 20
    duration = duration || null

    initState.tension = tension
    initState.friction = friction

    have_duration = duration !== null
    if (have_duration) {
      time_lapsed = springRK4Factory(tension, friction)
      dt = time_lapsed / duration * DT
    } else {
      dt = DT
    }

    while (true) {
      last_state = springIntegrateState(last_state || initState, dt)
      path.push(1 + last_state.x)
      time_lapsed += 16
      if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
        break
      }
    }
    return !have_duration ? time_lapsed : function (percentComplete: number): number {
      return path[(percentComplete * (path.length - 1)) | 0]
    }
  }
}())



export interface Easings {
  ease(progress: number): number
  easeIn(progress: number): number
  easeOut(progress: number): number
  easeInOut(progress: number): number
  easeInSine(progress: number): number
  easeOutSine(progress: number): number
  easeInOutSine(progress: number): number
  easeInQuad(progress: number): number
  easeOutQuad(progress: number): number
  easeInOutQuad(progress: number): number
  easeInCubic(progress: number): number
  easeOutCubic(progress: number): number
  easeInOutCubic(progress: number): number
  easeInQuart(progress: number): number
  easeOutQuart(progress: number): number
  easeInOutQuart(progress: number): number
  easeInQuint(progress: number): number
  easeOutQuint(progress: number): number
  easeInOutQuint(progress: number): number
  easeInExpo(progress: number): number
  easeOutExpo(progress: number): number
  easeInOutExpo(progress: number): number
  easeInCirc(progress: number): number
  easeOutCirc(progress: number): number
  easeInOutCirc(progress: number): number
}

export let easings: Easings = {
  ease: bezier(0.25, 0.1, 0.25, 1.0),
  easeIn: bezier(0.42, 0.0, 1.00, 1.0),
  easeOut: bezier(0.00, 0.0, 0.58, 1.0),
  easeInOut: bezier(0.42, 0.0, 0.58, 1.0),
  easeInSine: bezier(0.47, 0, 0.745, 0.715),
  easeOutSine: bezier(0.39, 0.575, 0.565, 1),
  easeInOutSine: bezier(0.445, 0.05, 0.55, 0.95),
  easeInQuad: bezier(0.55, 0.085, 0.68, 0.53),
  easeOutQuad: bezier(0.25, 0.46, 0.45, 0.94),
  easeInOutQuad: bezier(0.455, 0.03, 0.515, 0.955),
  easeInCubic: bezier(0.55, 0.055, 0.675, 0.19),
  easeOutCubic: bezier(0.215, 0.61, 0.355, 1),
  easeInOutCubic: bezier(0.645, 0.045, 0.355, 1),
  easeInQuart: bezier(0.895, 0.03, 0.685, 0.22),
  easeOutQuart: bezier(0.165, 0.84, 0.44, 1),
  easeInOutQuart: bezier(0.77, 0, 0.175, 1),
  easeInQuint: bezier(0.755, 0.05, 0.855, 0.06),
  easeOutQuint: bezier(0.23, 1, 0.32, 1),
  easeInOutQuint: bezier(0.86, 0, 0.07, 1),
  easeInExpo: bezier(0.95, 0.05, 0.795, 0.035),
  easeOutExpo: bezier(0.19, 1, 0.22, 1),
  easeInOutExpo: bezier(1, 0, 0, 1),
  easeInCirc: bezier(0.6, 0.04, 0.98, 0.335),
  easeOutCirc: bezier(0.075, 0.82, 0.165, 1),
  easeInOutCirc: bezier(0.785, 0.135, 0.15, 0.86)
}
