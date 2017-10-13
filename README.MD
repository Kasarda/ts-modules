# ts-modules

Typescript, Sass modules and CLI for Modular starter-kit
```bash
$ npm i -g ts-modules
$ modular new App
$ modular serve
```

## Typescript Module

### Animation
Module provide animejs animation engine and timing functions
```js
import { Animation, bezier, steps, spring } from 'ts-modules/animation'

// animejs framework - http://animejs.com/documentation/
Animation({
  targets: '#cssSelector .el',
  translateX: 250
})

// Timing functions
bezier(0, 1, 0, 1)(progress)

steps(5)(progress)

spring(100,7,500)(progress)
```

### Parallax
Module provide simple function to create parallax effects using CSS transform propery and opacity
```js
import { easings } from 'ts-modules/animation'
import { Parallax } from 'ts-modules/parallax'

Parallax({
  targets: '#cssSelector .el',
  progress: progress => easings.easeIn(progress),
  duration: 300, 
  translateX: [ 0, 200 ] // from transformX(0px) to transformX(200px),
  opacity: [ 0, 1, 100, 200 ] // from 0 to 1, but animation start 100px before element is in view and end 200px after is in view
  deepProgress(scroll_progress, animation_progress){
    this.innerHTML = scroll_progress
  }
  })
```

### Worker
Simple way to comunicate with WebWorker
```js
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


        <Link path={/^(home|)$/}><a href="#home"> Home </a></Link>
        <Link path="about" active="someDifClass"><a href="#about"> About </a></Link>
        <Link path="contact"><a href="#contact"> Contact </a></Link>

          // if [path] match location.hash this link will be has class from [active] or by default .active
  
      </div>
      )
  }
}
```

## Sass Module

### animation
CSS classes for @keyframe animation

### grid
Boostrap 4 grid

### visibility
Boostrap 4 visibility

### normalize
css reset

### lib
sass library
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
## CLI
### modular new ?<folder_name>
Clone modular starter-kit and install depensdencies
```bash
$ modular new App
$ modular new     // default name is 'modular'
```
### modular pull \<repo> ?<folder_name>
Clone <repo> and install depensdencies
  
```bash
$ modular pull https://github.com/kasarda/ts-modules.git
$ modular pull git@github.com:kasarda/ts-modules.git App
$ modular pull kasarda/ts-modules
```
### modular component <name> ?<options>
Create React component with sass file
#### ?<options>
- !css - Create component without sass file
- in=<parent_component> - Create sub component
  
```bash
$ modular component About
$ modular component Contact !css
$ modular component Address in=Contact
$ modular component Street in=Contact/Address !css
```
```
+ app/About/About.component.tsx
+ app/About/About.sass

+ app/Contact/Contact.component.tsx

+ app/Contact/Address/Address.component.tsx
+ app/Contact/Address/Address.sass

+ app/Contact/Address/Street/Street.component.tsx
```
### modular serve | build | test | install
Run NPM or Yarn command 
  
```bash
$ modular serve
$ modular build
$ modular test
```

### modular version
Get version of CLI

### modular ?\<anything>
Get Documentation

