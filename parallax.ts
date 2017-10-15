/**
  *
  * @module parallax
  *
  * Creating parallax animation via css tranform propeties and opacity
  *
*/

import { getValue, getProgress, inView, createRequestFrame, setStyles } from './common'




export interface ParallaxOptions extends Properties {
  targets: any
  duration?: number

  progress?: (this: any, data: DataArgument) => void
  timing?: (this: any, data: DataArgument & TimingDataArgument) => number
  deepProgress?: (this: any, data: DataArgument & DeepProgressDataArgument) => void
}


interface Properties {
  translateX?: number[]
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



/**
  *
  * @function Parralax
  * Function to provide parallax animation
  *
*/

export function Parallax(options: any) {

  /**
    *
    * Settings constant from {options} param
    *
  */
  const targets: any = options.targets
  const elements: Element[] = typeof targets === 'string' ? Array.from(document.querySelectorAll(targets)) : targets.length ? Array.from(targets) : [targets]
  const duration: number = options.duration || 400
  const timing: (this: Element, data: DataArgument & TimingDataArgument) => number = options.timing

  const list_of_supported_properties: (keyof Properties)[] = ['translateX', 'translateY', 'scale', 'rotate', 'opacity', 'skewX', 'skewY', 'skew', 'translateZ', 'rotateZ', 'rotateX', 'rotateY', 'scaleX', 'scaleY', 'scaleZ', 'translate', 'perspective']
  const properties: any = {}
  list_of_supported_properties.forEach(prop => options[prop] && (properties[prop] = options[prop]))


  elements.forEach((elem: any, index: number): void => {


    /**
      *
      * Set scroll position before update to define min and max value of css property
      *
    */
    let scroll_position_before: number = document.documentElement.scrollTop


    const elem_rect: ClientRect = elem.getBoundingClientRect()
    const min: number = ((elem_rect.top) + document.documentElement.scrollTop) - window.innerHeight
    const max: number = ((elem_rect.top) + document.documentElement.scrollTop) + elem_rect.height

    /**
      *
      * @function update
      * Update css property and create animation
    */

    function update(event: ParallaxEvent): void {
      const scroll_position: number = document.documentElement.scrollTop

      event.scrollTop = scroll_position
      event.element = elem
      event.inView = inView(elem)
      event.options = options

      /**
        *
        * Get default value and value of transform function or opacity
        *
      */
      const transform: any[] = []
      const opacity: number[] = []
      let scroll_progress: any
      for (const prop in properties) {

        const prop_val: number[] = properties[prop]

        /**
          *
          * Get default value and value of transform function or opacity
          *
        */
        const minus_max: number = prop_val[2] || 0
        const minus_min: number = prop_val[3] || 0

        scroll_progress = getProgress(min - minus_min, max - minus_max, scroll_position)
        const scroll_def_progress: number = getProgress(min - minus_min, max - minus_max, scroll_position_before)

        const value: number = getValue(prop_val[0], prop_val[1], scroll_progress)
        const default_value: number = getValue(prop_val[0], prop_val[1], scroll_def_progress)

        /**
          *
          * Get unit of transform function
          *
        */
        let unit: string = 'px'

        if (prop.match(/^(rotate|rotateX|rotateZ|rotateY|skew|skewX|skewY)$/)) unit = 'deg'
        if (prop.match(/^(scale|scaleX|scaleY|scaleZ)$/)) unit = ''


        /**
          *
          * Push data for @function render function
          *
        */
        if (prop === 'opacity')
          opacity.push(default_value, value)
        else
          transform.push([prop, default_value, value, unit])

      }

      const data_argument: DataArgument = {
        element: elem,
        index,
        scrollProgress: scroll_progress,
        event
      }

      if (typeof options.progress === 'function')
        options.progress.call(elem, data_argument)

      /**
        *
        * @function render
        * Creating animation
        *
      */
      function render(p: number): void {

        data_argument.progress = p
        const progress: number = timing ? timing.call(elem, data_argument) : p
        data_argument.timingProgress = progress

        if (transform.length) {
          let transform_string: string = ''
          transform.forEach(trans => {
            const transform_value: number = getValue(trans[1], trans[2], progress)
            transform_string += trans[0] + '(' + transform_value + trans[3] + ') '
          })
          setStyles(elem, 'transform', transform_string)
        }

        if (opacity.length)
          elem.style.opacity = getValue(opacity[0], opacity[1], progress)


        if (typeof options.deepProgress === 'function')
          options.deepProgress.call(elem, { element: elem, index, scrollProgress: scroll_progress, timingProgress: progress, progress: p, event })
      }


      createRequestFrame(duration, render)


      /* updating scroll_position_before */
      scroll_position_before = scroll_position
    }





    /**
      *
      * Initialize
      *
    */
    update(<any>{})
    document.addEventListener('scroll', update)

  })
}
