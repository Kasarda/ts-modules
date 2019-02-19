/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2018-Present, Filip Kasarda
  *
  */
 
class Pinner {
    constructor({
        container,
        target,
        onPin,
        onEnd,
        onStart
    }) {

        this.BOTTOM = 'BOTTOM'
        this.TOP = 'TOP'

        this.container = this._elem(container)
        this.target = this._elem(target)
        this.onPin = onPin
        this.onEnd = onEnd
        this.onStart = onStart

        // Error handling
        if (!(this.container instanceof HTMLElement))
            throw new Error('Container must be a HTML element or valid CSS selector')

        if (!(this.target instanceof HTMLElement))
            throw new Error('Target must be a HTML element or valid CSS selector')

        window.addEventListener('scroll', _ => this.updatePin())
        this.updatePin()
    }

    updatePin() {
        const containerRect = this.container.getBoundingClientRect()
        const targetRect = this.target.getBoundingClientRect()
        const targetStyle = getComputedStyle(this.target)
        const containerStyle = getComputedStyle(this.container)

        const overflow = (containerRect.top + containerRect.height) - targetRect.height

        // Make sure that all positions are correct
        if (containerStyle.position === 'static')
            this.container.style.position = 'relative'

        if (!['absolute', 'fixed'].includes(targetStyle.position)) {
            this.target.style.position = 'absolute'

            if (containerRect.top > 0) {
                this.target.style.top = 0
                this.target.style.bottom = 'auto'
                this._trigger(this.onPin, 0)
            }
            else {
                this.target.style.bottom = 0
                this.target.style.top = 'auto'
                this._trigger(this.onPin, 1)
            }
        }


        // If target is visible on the screen then set fixed position
        if (containerRect.top <= 0 && overflow > 0) {

            if (targetStyle.position !== 'fixed') {
                this.target.style.position = 'fixed'
                this.target.style.top = 0
                this.target.style.bottom = 'auto'

                const direction = Math.abs(containerRect.top) < Math.abs(overflow) ? this.TOP : this.BOTTOM
                this._trigger(this.onStart, direction)
                this._trigger(this.onPin, 0)
            }

            // Update every time you scroll
            const progress = this._getProgress(0, containerRect.height - targetRect.height, Math.abs(containerRect.top))
            this._trigger(this.onPin, progress)
        }



        // Unset position fixed when needs to
        if (targetStyle.position === 'fixed') {

            // BOTTOM direction
            if (containerRect.top > 0) {
                this.target.style.position = 'absolute'
                this.target.style.top = 0
                this.target.style.bottom = 'auto'
                this._trigger(this.onEnd, this.BOTTOM)
                this._trigger(this.onPin, 0)
            }

            // TOP direction
            if (overflow <= 0) {
                this.target.style.position = 'absolute'
                this.target.style.top = 'auto'
                this.target.style.bottom = 0
                this._trigger(this.onEnd, this.TOP)
                this._trigger(this.onPin, 1)
            }
        }
    }

    _getProgress(from, to, value) {
        const max = to - from
        const user_value = value - from
        const progress = user_value / max

        return Math.max(Math.min(progress, 1), 0)
    }

    _trigger(fn, ...data) {
        if (typeof fn === 'function')
            fn.call(this, ...data)
    }

    _elem(selector) {
        return selector instanceof HTMLElement ? selector : document.querySelector(selector)
    }

}



module.exports = Pinner