# Ts-modules

TypeScript, Sass modules and CLI for [Modular](https://github.com/kasarda/modular) starter-kit

# Modular

Modular is front-end starter kit using Webpack, React and TypeScript.

```bash
$ npm i -g ts-modules
$ modular new App
$ modular serve
```
## Content
- [Modular includes](#modular-includes)
- [Ts-modules](#ts-modules-1)
  - [TypeScript Modules](#typescript-modules)
    - [Animation](#animation)
    - [Parallax](#parallax)
    - [Worker](#worker)
    - [React](#react)
  - [SASS Modules](#sass-modules)
    - [Animation](#animation-1)
    - [Grid](#grid)
    - [Visibility](#visibility)
    - [Normalize](#normalize)
    - [SASS library](#library)
  - [CLI](#cli)
    - [modular new](#modular-new-folder_name)
    - [modular pull](#modular-pull-repo-folder_name)
    - [modular component](#modular-component-name-options)
    - [modular serve - build - test - install](#modular-serve--build--test--install)
    - [modular -V](#modular--v)
    - [modular ...](#modular-anything_else)
- [Modular.json](#modularjson)

## Modular includes:

- React 16
- Webpack 3
- TypeScript 2
- Sass, Jade/Pug
- TypeScript Mocha Testing
- Progressive web app using ServiceWorker, AppCache and manifest.json
- Babel Polyfill
- CLI for clone, install, serve or build App or for generating React component
- [WebWorker](https://github.com/kasarda/ts-modules/blob/master/worker.ts)
- [Animation engine via animejs](https://github.com/kasarda/ts-modules/blob/master/animation.ts)
- [Parallax engine](https://github.com/kasarda/ts-modules/blob/master/parallax.ts)
- [React for ts-modules](https://github.com/kasarda/ts-modules/blob/master/react.tsx)
- [SASS library](https://github.com/kasarda/ts-modules/blob/master/lib.sass)
- CSS frameworks
  - [animation](https://github.com/kasarda/ts-modules/blob/master/animation.sass)
  - [normalize](https://github.com/kasarda/ts-modules/blob/master/normalize.sass)
  - [Bootstrap 4 grid](https://github.com/kasarda/ts-modules/blob/master/grid.sass)
  - [visibility](https://github.com/kasarda/ts-modules/blob/master/visibility.sass)
- CSS autoprefixer
- ...



---
# Ts-modules

TypeScript, Sass modules and CLI for [Modular](https://github.com/kasarda/modular) starter-kit
```bash
$ npm i -g ts-modules
$ modular new App
$ modular serve
```
---
## TypeScript Modules

### Animation
Module provide [animejs](http://animejs.com/documentation/) animation engine and timing functions
```ts
import { Animation, bezier, steps, spring } from 'ts-modules/animation'

// animejs framework - http://animejs.com/documentation/
Animation({
  targets: '#cssSelector .el',
  translateX: 250
})

// Timing functions
bezier(0, 1, 0, 1)(progress)

steps(5)(progress)

spring(100, 7, 500)(progress)
```

### Parallax
Module provide simple function to create parallax effects using CSS transform propery and opacity
```ts
/// interfaces
interface ParallaxOptions extends Properties {
    targets: any
    duration?: number

    progress?: (this: any, data: DataArgument) => void
    timing?: (this: any, data: DataArgument & TimingDataArgument) => number
    deepProgress?: (this: any, data: DataArgument & DeepProgressDataArgument) => void
}


interface Properties {
  translateX?: number[] // translateX:  [min_value, max_value, min_value_offset?, max_value_offset?]
  translateY?: number[]
  translateZ?: number[]
  translate?: number[]

  scale?: number[]
  scaleX?: number[]
  scaleY?: number[]
  scaleZ?: number[]

  rotate?: number[]
  rotateX?: number[]
  rotateY?: number[]
  rotateZ?: number[]

  skew?: number[]
  skewX?: number[]
  skewY?: number[]

  perspective?: number[]

  opacity?: number[]
}

interface DataArgument {
  element: any
  index: number

  scrollProgress: number
  progress?: number
  timingProgress?: number

  event: ParallaxEvent
}

interface TimingDataArgument { progress: number }
interface DeepProgressDataArgument extends TimingDataArgument { timingProgress: number }

interface ParallaxEvent extends Event {
  scrollTop: number
  element: any
  inView: boolean
  options: ParallaxOptions
}

///// app.ts
import { easings } from 'ts-modules/animation'
import { Parallax, ParallaxOptions  } from 'ts-modules/parallax'



const options: ParallaxOptions = {

targets: '.box',
duration: 500, // default is 400

timing: ({ progress }) => easings.easeOutExpo(progress),

progress({ index, scrollProgress }){
    if( index === 0)
        this.innerHTML = scrollProgress
},


deepProgress({ progress, timingProgress, scrollProgress }){

    scrollProgress // progress of the scroll
    /*
      element is not visible on the screen and is under the screen   - 0
      element is not visible on the screen and is over the screen    - 1

      this progress can be affected by third and fourth item in Properties array
      e.g. transformX: [0, 100, 100, 300]
    */
    progress // progress of animation affected by duration
    /*
        start of the animation - 0
        end of the animation   - 1
    */

    timingProgress // progress of the animation affected by timing() function

},


/**
 * translateX from 0px to 100px
 * scrollProgress return 1, 50px before element will be not visible on the screen
 * and scrollProgress return more then 0, 200px before element will be visible on the screen
 */
translateX: [0, 100, 50, 200],
opacity: [1, 0]


}

Parallax(options)

```

### Worker
Simple way to comunicate with WebWorker
```ts
/////// app.ts
import { WebWorker, WebWorkerInterface } from 'ts-modules/worker'
import * as MainWorker from 'worker-loader!./worker.ts'

const worker: WebWorkerInterface = new WebWorker(MainWorker)

worker.send('message from app', {name: 'John', text: 'Hello Worker! How are you?'})

worker.read('response from worker', data => {
  console.log(data)
  worker.terminate()
})


/////// worker.ts
import { WebWorker, WebWorkerInterface } from 'ts-modules/worker'
const worker: WebWorkerInterface = new WebWorker()

worker.read('message from app', data => {
  worker.send('response from worker', `Hello ${data.name}! I'm fine`)
})
```

### React
Module to provide React, ReactDOM and simple Hash Routing
```jsx
import { React, ReactDOM, Router, Routes, Link } from 'ts-modules/react'

import Home from './Home/Home.component'
import About from './About/About.component'
import NotFound from './NotFound/NotFound.component'

class App extends React.Component<any, any>{
  constructor(){
      super()
      new Router(this) // create event listener on hash change, update this.state.path on every hash change and trigger method onHashChange
  }

  onHashChange(newHash, event){
   // 'this' is App not Window
 }

 render(){
  Router.redirect('home', '') // if hash will be home, location will be updated to '' hash

  return (
    <div id="app">

      <Routes>
        <Home path={/^home|main|$/} />
        <About path='about' />
        <NotFound notFound />
      </Routes>


        <Link path={/^home|main|$/}><a href="#home"> Home </a></Link>
        <Link path="about" active="someDifClass"><a href="#about"> About </a></Link>
        <Link path="contact"><a href="#contact"> Contact </a></Link>

          // if [path] match location.hash this link will be has css class from [active] or by default .active

      </div>
      )
  }
}
```
---
## Sass Modules

### Animation
CSS classes for @keyframe animation
[animation.sass](https://github.com/kasarda/ts-modules/blob/master/animation.sass)

```sass
@import '~ts-modules/animation'
```
```html
 <div class="animate easeIn slow zoomOut"></div>
```

### Grid
Bootstrap 4 grid
[grid.sass](https://github.com/kasarda/ts-modules/blob/master/grid.sass)

```sass
@import '~ts-modules/grid'
```
```html
 <div class="container">
    <div class="row">
      <div class="col-6 col-lg-2"></div>
      <div class="col col-md-auto"></div>
      <div class="col-5"></div>

    </div>
 </div>
```
### Visibility
Bootstrap 4 visibility
[visibility.sass](https://github.com/kasarda/ts-modules/blob/master/visibility.sass)

```sass
@import '~ts-modules/visibility'
```
```html
 <div class="hidden-xs-up"></div>
 <div class="text-hide"></div>
 <div class="invisible"></div>
```
### Normalize
CSS reset
[normalize.sass](https://github.com/kasarda/ts-modules/blob/master/normalize.sass)
```sass
@import '~ts-modules/normalize'
```
### Library
Sass library
[lib.sass](https://github.com/kasarda/ts-modules/blob/master/lib.sass)

```sass
@import '~ts-modules/lib'

// font-face using .ttf (name, file_without_ext, weight=normal, font-style=normal)

+face('fancy', '/assets/fancy', 400)

body
  font-family: 'fancy'

// centering (x|y|both) || ()

.centerX
  +center(x)

.centerY
  +center(y)

.center
  +center

// foreground (font-size?, color?, weight?, line-height?, font-style?)

h1
 +foreground(1.5em, #444, 400, 1, normal)


// Dimension (width=100%, height=same_as_width)

.parent_dimension
  +dimension
.square
  +dimension(100px)
.rectangle
  +dimension(100px, 200px)
.only-height
  +dimension(false, 200px)


// position (top?, left?, bottom?, right?, position=relative)

.top_left_absolute
  +position(100px, 200px, absolute)

.left_bottom_sticky
  +position(false, 200px, 100px, sticky)
.left_relative
  +position(100px)


// Media query with bootstrap shorthands or custom value

+min(lg)
  h1
   font-size: .8em

+max(xs)
  h1
   font-size: .6em

+max(1400px)
   h2
    font-size: 1em

+only(sm)
  h1
   font-size: .4em

+only(100px, 300px)
  h1
   font-size: .4em


// Retina media query

.bg
  +retina(img-1x.jpg, img-2x.jpg, 100px, 150px)

+retina
  .bg
    background: img-2x.jpg
    background-size: 100px, 150px


// Gradients
.grad_x
  +gradient-x(red, green, 20%, 100%)
.grad_y
  +gradient-y(red, green, 20%, 100%)
.grad_directional
  +gradient-directional(red, green, 45deg)
.grad_x-three-colors
  +gradient-x-three-color(red, green, 50%, blue)
.grad_y-three-colors
  +gradient-y-three-color(red, green, 50%, blue)
.grad_radial
  +gradient-radial(red, green)
.grad_striped
  +gradient-striped(red,45deg)

```
---
## CLI
### modular new [\<folder_name>] [-yarn]
Clone modular starter-kit and install dependencies

```bash
$ modular new App
$ modular new     // default <folder_name> is 'modular'
```
### modular pull \<repo> [\<folder_name>] [-yarn]
Clone \<repo> and install dependencies

```bash
$ modular pull  https://github.com/kasarda/ts-modules.git   // <folder_name> is 'ts-modules'
$ modular pull  git@github.com:kasarda/ts-modules.git       App
$ modular pull  kasarda/ts-modules                          // <folder_name> is 'ts-modules'
```
### modular component \<name> [\<options>]
Create React component with css file
#### [\<options>]
- !css - Create component without css file
- functional - Create component using function not class
- in=<parent_component> - Create sub component

```bash
$ modular component About
$ modular component Contact !css
$ modular component Address in=Contact
$ modular component Street in=Contact/Address !css functional
```
```
+ app/About/About.component.tsx
+ app/About/About.sass

+ app/Contact/Contact.component.tsx

+ app/Contact/Address/Address.component.tsx
+ app/Contact/Address/Address.sass

+ app/Contact/Address/Street/Street.component.tsx
```
### modular serve | build | test | install [-yarn]
Run NPM command

```bash
$ modular serve
$ modular build
$ modular test
$ modular install -yarn
```

### modular -V
Get version of the CLI

### modular [\<anything_else>]
Get Documentation

---
# Modular.json
Configuration for Webpack

```ts
{
    "entry": "./src/app.tsx", // Entry point of the application
    "markup": "./src/index.jade", // possible templates are .jade | .pug | .html with ejs
    "favicon": "./src/assets/favicon.ico",
    "styles": "sass", // possible values are sass | scss | css
        // if value is sass or scss, sass-loader will be applied
        // if we generating component using $ modular component, css template will be depend on this property

    "server": { // configuration for dev server
        "port": 8080,
        "https": false,
        "openInBrowser": true
    },

    "progressive": { // Configuration of the Progressive Web App using offline-plugin for Webpack
        "active": false, // if false Service Worker will be not active
        "entry": null, // entry point of yours own Service Worker file
        "main": [ // main files to provide in SW
            "app.bundle.css",
            "app.bundle.js"
        ],
        "additional": [ // additional files to provide in SW
            ":externals:"
        ],
        "optional": [ // optional files to provide in SW
            ":rest:"
        ],
        "excludes": [] // exclude files
    },

    "sub": [ // Creating multiple entries
      /*
        If we add new entry, inject option in HTML Webpack plugin will be set to false,
        so we have to set js, css and favicon in all templates by hand
      */

      {
        "entry": "./src/about/about.tsx", // new entry point, name of the entry point will be filename so output will be "about.bundle.js"
        "markup": "./src/about/about.jade" // entry point of the template, output name will be filename + ".html" so "about.html"
      },

       {
        "entry": "./src/contact/contact.tsx", // "contact.bundle.js"
        "markup": "./src/contact/something.jade" // "something.html"
      }

    ]
}
```
