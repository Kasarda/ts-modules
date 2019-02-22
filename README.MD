# Utilities for JavaScript, CSS and SASS

<ul>
    <li><a href="#install-package">Install</a></li>
    <li><a href="#javascript">JavaScript</a></li>
    <ul>
        <li><a href="#common">Common</a></li>
        <li><a href="#view">View</a></li>
        <li><a href="#worker">Worker</a></li>
        <li><a href="#createElement">createElement</a></li>
        <li><a href="#chunk">Chunk</a></li>
        <li><a href="#history">History</a></li>
        <li><a href="#others">Others</a></li>
    </ul>
    <li><a href="#css">CSS</a></li>
    <li><a href="#sass">SASS</a></li>
</ul>

<h1 id="install-package">Install</h1>

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
    rand,
    getProgress,
    getValue,
    item,
    setStyles,
    animationLoop,
    minmax
} from 'kasarda/common'
/* 
import rand from 'kasarda/common/rand'
import getProgress from 'kasarda/common/getProgress'
import getValue from 'kasarda/common/getValue'
import setStyles from 'kasarda/common/setStyles'
import animationLoop from 'kasarda/common/animationLoop'
import minmax from 'kasarda/common/minmax'
*/

/** 
 * rand(from:number|string|any[]|object, to:number = 0, round:boolean = true): number
 * -> Return random value
*/
rand(0, 100) // return random integer value from 0 to 100
rand(0, 100, false) // return random float value from 0 to 100
rand('abcdefghijklmno') // return random character from string
rand(['turkey', 'elephant', 'tiger']) // return random value from array
rand({
    name: 'Joe',
    age: 26
}) // return random value from object



/**
 *  getProgress(from:number, to:number, value:number, outside:boolean = false):number
 * -> Return progress between 0 and 1 or outside of this range 
*/
getProgress(0, 100, 50) // -> .5
getProgress(0, 100, 150) // -> 1
getProgress(0, 100, 150, true) // -> 1.5



/** 
 * getValue(startWith:number, endWith:number, progress:number, fixed:number = 6):number
 * -> Return value from progress
*/
getValue(0, 100, .5) // -> 50
getValue(0, 100, .3458) // -> 34.58
getValue(0, 100, .3458, 0) // -> 35



/**
 * item(array:any[], index:number):any
 * -> get item from array by index
*/
const arr = [ 1, 2, 3 ]
item(arr, 0) // -> 1
item(arr, 1) // -> 2
item(arr, -1) // -> 3
item(arr, -2) // -> 2


/**
 * setStyles(elem:element, styles:string|object, value:string|number):void
 * -> Set styles on element and add prefix if needed
 */
const elem = document.querySelector('.box')
setStyles(elem, 'transform', 'translateX(30px)')
setStyles(elem, {
    transform: 'translateX(30px)',
    width: 200 + 'px'
})



/**
 * createRequestFrame(duration:number, frame:function(data), done:function(requestID))
 * -> create requestAnimationFrame loop with duration
 */
animationLoop(
    5000, // ms
    ({progress, runtime, remaining, runned, timestamp, requestID}) => {
    // If the progress is ~.25
    progress // -> .25
    runtime // -> 1250.458
    remaining // -> 3750
    runned // -> 1250
    timestamp // -> 1522264007309
    requestID // -> 70

    if(progress > .5)
        return false // stop requesting when return false

},
requstID => {
    console.log('Done with ID', requestID)
})

/**
 * minmax(min:number, max:number, value:number)
 * -> get number value in range of min and max
 */

minmax(0, 10, 5) // -> 5
minmax(0, 10, -5) // -> 0
minmax(0, 10, 15) // -> 10
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

const worker = new WebWorker('greeting_worker.js')

worker.send('greeting', 'hello')

worker.read('response', data => {
    data // -> 'hi!'
    worker.terminate()
})

// greeting_worker.js
import WebWorker from 'kasarda/worker'

const worker = new WebWorker()
worker.read('greeting', data => {
    data // -> 'hello'

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



<h2 id="createElement">createElement</h2>
<p>
    Create element object just like document.createElement but with more options
</p>

```javascript
import createElement from 'kasarda/createElement'

/*
    API:
    createElement(selector:string, options:Options|string|array, condition?:boolean)

interface Options = {
    className: string | [string] | Promise(string|[string]),
    attr: object, // key is attr name and value is attr value. Value can be a Promise
    prop: object, // key is prop name and value is prop value. Value can be a Promise
    data: object // key is data name and value is data value. Value can be a Promise
    style: object // key is style name and value is style value. Value can be a Promise
    child: element | [element|Promise(element|[element])] | Promise(element, [element|Promise(element|[element])]),
    text: any | Promise(any),
    html: any | Promise(any),
    src: string | Promise(any),,
    on: object // key is eventName name and value is listener,
    appendTo: element,
    prependTo: element,
    ref: Function(element, Options) // this is also element
    appendFutureChilds:boolean = false
}
*/



// selector example:
createElement('section') // <section>
createElement('.wrapper') // <div class="wrapper">
createElement('.a.b.c') // <div class="a b c">
createElement('nav#main.light-theme') // <nav id="main" class="light-theme">
createElement('input[placeholder=Name][name=name][type=text]') // <input placeholder="Name" name="name" type="text">



// Options example:
createElement('nav', {
    className: ['light', 'main'],
    attr: {
        tabindex: 1
    },
    data: {
        visible: true
    },
    style: {
        width: 100 + '%',
        height: CSS.px(100)
    },
    child: [
        createElement('a[href=#a]'),
        createElement('a[href=#b]'),
        createElement('a[href=#c]')
    ],
    on: {
        click: _ => console.log('clicked')
    },
    appendTo: document.body,
    ref() {
        this.tagName === 'NAV' // -> true
    }
})
/*
<nav class="light main" tabindex="1" data-visible="true" style="width:100%;height: 100px;">
    <a href="#a">
    <a href="#b">
    <a href="#c">
</nav>
*/


// condition example:
createElement('div', {}, true) // <div>
createElement('div', {}, false) // null


// promises example:
createElement('img', {
    src: fetch('some api').then(data => data.json()).then(data => data.pictureURL)
})


// Shorthand syntax example:
// second arguments as an string is same as option text or src for image element
createElement('span', 'Hello World') // <span>Hello World</span>
createElement('img', 'img.jpg') // <img src="img.jpg">


// second arguments as an array is same as option child
createElement('.wrapper', [
    createElement('nav', [
        createElement('a'),
        createElement('a')
        createElement('a')
    ]),
    createElement('section', [/*...*/]),
    createElement('footer', [/*...*/]),
]) /*
    <div class="wrapper">
      <nav>
        <a>
        <a>
        <a>
      </nav>
      <section>
        ...
      </section>
      <footer>
        ...
      </footer>
    </div>
*/
```

<h2 id="chunk">Chunk</h2>
<p>
    Create chunk array
</p>

```javascript
import Chunk from 'kasarda/chunk'

const chunk = new Chunk(5)

chunk.onFull(data => {
    console.log(data) 
    /* 
        -> [0,1,2,3,4]
        -> [5,6,7,8,9]
        -> [10,11]
    */
})

for(let i = 0; i < 12; i++) {
    chunk.add(i)
}
chunk.end()
```

<h2 id="history">History</h2>
<p>
    Create history array
</p>

```javascript
import History from 'kasarda/history'

const history = new History

history.push('a')
history.push('b')
history.push('c')
history.states // -> ['a', 'b', 'c']

history.currentState // -> 'c'
history.back()
history.currentState // -> 'b'
history.back()
history.currentState // -> 'a'
history.forward()
history.currentState // -> 'b'
history.push('d')
history.states // -> ['a', 'b', 'd']
history.currentState // -> 'd'
history.isLast // -> true
history.back()
history.currentState // -> 'b'
history.to(0)
history.currentState // -> 'a'
history.isFirst // -> true
history.get(1) // -> 'b'
history.updateState(1, 'e')
history.get(1) // -> 'e'
history.clear()
history.currentState // -> undefined

history.addEventListener('change', e => {})
history.addEventListener('push', e => {})
history.addEventListener('beforechange', e => {})
history.addEventListener('beforepush', e => {})
history.addEventListener('clear', e => {})
```
<h2 id="others">Others</h2>
<ul>
    <li><a href="https://codepen.io/kasarda/pen/mamybq">Pinner</a></li>
    <li><a href="https://codepen.io/kasarda/pen/OrrWwe">Scroll</a></li>
    <li><a href="https://codepen.io/kasarda/pen/jXwmoy">Interaction</a></li>
    <li><a href="https://codepen.io/kasarda/pen/REVewe">SlideShow</a></li>
</ul>

<h1 id="css">CSS</h1>
<ul>
    <li><a href="https://github.com/kasarda/kasarda/blob/master/flex.css">flex</a></li>
    <li><a href="https://github.com/kasarda/kasarda/blob/master/visibility.css">visibility</a></li>
    <li><a href="https://github.com/kasarda/kasarda/blob/master/normalize.css">normalize</a></li>
</ul>


<h1 id="sass">SASS</h1>
<ul>
    <li><a href="https://github.com/kasarda/kasarda/blob/master/lib.sass">lib</a></li>
</ul>
