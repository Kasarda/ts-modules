# Utilities for JavaScript, CSS and SASS

<ul>
    <li><a href="#install">Install</a></li>
    <li><a href="#javascript">JavaScript</a></li>
    <ul>
        <li><a href="#common">Common</a></li>
        <li><a href="#view">View</a></li>
        <li><a href="#worker">Worker</a></li>
        <li><a href="#easing">Easing</a></li>
    </ul>
    <li><a href="#css">CSS</a></li>
    <li><a href="#sass">SASS</a></li>
</ul>

<h1 id="install">Install</h1>
<h3>NPM</h3>
<code>
   $ npm i kasarda
</code>

<h3>Yarn</h3>
<code>
   $ yarn add kasarda
</code>

<h1 id="javascript">JavaScript</h1>
<h2 id="common">Common</h2>

```javascript
import {
    unique,
    isPlain
    rand
    getProgress
    getValue
    item
    setStyles
    createRequestFrame
} from 'kasarda/common'

// unique(array:any[]):any[]
const array = [1, 4, 5, 3, 3, 2, 1]
unique(array) // [1, 4, 5, 3, 2]


// isPlain(obj:any):boolean
const obj = { uid: 15878 }
const promise = new Promise(resolve => {});

isPlain(obj) // true
isPlain(promise) // false


// rand(from:number|string|any[]|object, to:number = 0, round:boolean = true): number
rand(0, 100) // return random integer value from 0 to 100
rand(0, 100, false) // return random float value from 0 to 100
rand('abcdefghijklmno') // return random character from string
rand(['turkey', 'elephant', 'tiger']) // return random value from array
rand({
    name: 'Joe',
    age: 26
}) // return random value from object



// getProgress(from:number, to:number, value:number, outside:boolean = false):number
// Return progress between 0 and 1 or outside of this range
getProgress(0, 100, 50) // .5
getProgress(0, 100, 150) // 1
getProgress(0, 100, 150, true) // 1.5



// getValue(startWith:number, endWith:number, progress:number, fixed:number = 6):number
// Return value from progress

getValue(0, 100, .5) // 50
getValue(0, 100, .3458) // 34.58
getValue(0, 100, .3458, 0) // 35



// item(array:any[], index:number):any
const arr = [ 1, 2, 3 ]
item(arr, 0) // 1
item(arr, 1) // 2
item(arr, -1) // 3
item(arr, -2) // 2


// setStyles(elem:element, styles:string|object, value:string|number):void
const elem = document.querySelector('.box');
setStyles(elem, 'transform', 'translateX(30px)') // <div class="box" style="transform:translateX(30px);-webkit-transform:translateX(30px);">

setStyles(elem, {
    transform: 'translateX(30px)',
    width: 200 + 'px'
})



// createRequestFrame(duration:number, callback:function(), done: function())

createRequestFrame(
    5000, // ms
    (progress, runtime, remaining, runned, timestamp, requestID) => {
    // If the progress is ~.25
    progress // .25
    runtime // 1250.458
    remaining // 3750
    runned // 1250
    timestamp // 1522264007309
    requestID // 0

    if(progress > .5)
        return true // stop requesting

},
(requstID) => {
    console.log('Done with ID', requestID)
}

)
```

<h2 id="view">View</h2>
<p>
    Return true if the element is in the view -
    <a href="https://codepen.io/kasarda/pen/aENRje">Example</a>
</p>

```javascript
import inView from 'kasarda/view'

// inView(options: Options)
// example: https://codepen.io/kasarda/pen/aENRje
/*

 interface Options {
     target: element,
    visibility: string = 'visible' || 'entire',
    axis:string = 'y' || 'x' || 'both'
    direction:string = 'linear' || 'end' || 'start'
    offset = {
        top: number = 0,
        left: number = 0,
        bottom: number = 0,
        right: number = 0,
    }
 }
*/

const elem = document.querySelector('.box')

inView({
    target: elem,
    visibility: 'entire'
}) // if entire box element is visible on the screen this function will return true

```


<h2 id="worker">Worker</h2>

```javascript
import WebWorker from 'kasarda/worker'

const greetingWorker = new Worker('greeting_worker.js')
const worker = new WebWorker(greetingWorker)

worker.send('greeting', 'hello')

worker.read('response', data => {
    data // 'hi!'
    worker.terminate()
})

// greeting_worker.js
import WebWorker from 'kasarda/worker'

const worker = new WebWorker()
worker.read('greeting', data => {
    data // 'hello'

    worker.send('response', 'hi!')
})
```



<h2 id="easing">Easing</h2>

```javascript
import {
    bezier,
    steps,
    spring,
    easings
} from 'kasarda/easing'


// bezier(x1, y1, x2, y2)(progress)
bezier(0.25, 0.1, 0.25, 1.0)(.5) // new progress

// steps(steps)(progress)
steps(5)(.5) // new progress

// spring(tension, friction, duration)(progress)
spring(100, 20, 3000)(.5) // new progress

// easing -> predefined bezier easings
/*
    {
    ease(progress)
    easeIn(progress)
    easeOut(progress)
    easeInOut(progress)
    easeInSine(progress)
    easeOutSine(progress)
    easeInOutSine(progress)
    easeInQuad(progress)
    easeOutQuad(progress)
    easeInOutQuad(progress)
    easeInCubic(progress)
    easeOutCubic(progress)
    easeInOutCubic(progress)
    easeInQuart(progress)
    easeOutQuart(progress)
    easeInOutQuart(progress)
    easeInQuint(progress)
    easeOutQuint(progress)
    easeInOutQuint(progress)
    easeInExpo(progress)
    easeOutExpo(progress)
    easeInOutExpo(progress)
    easeInCirc(progress)
    easeOutCirc(progress)
    easeInOutCirc(progress)
    }
*/

easing.ease(.5) // new progress
easing.easeOutQuint(.5) // new progress

```


<h1 id="css">CSS</h1>
<ul>
    <li><a href="https://github.com/kasarda/kasarda/blob/master/normalize.css">normalize</a></li>
    <li><a href="https://github.com/kasarda/kasarda/blob/master/animation.css">animation</a></li>
    <li><a href="https://github.com/kasarda/kasarda/blob/master/flex.css">flex</a></li>
    <li><a href="https://github.com/kasarda/kasarda/blob/master/visibility.css">visibility</a></li>
</ul>


<h1 id="sass">SASS</h1>
<ul>
    <li><a href="https://github.com/kasarda/kasarda/blob/master/lib.sass">lib</a></li>
</ul>