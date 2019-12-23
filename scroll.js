class Scroll {
    constructor({
        target = window,
        onScroll,
        onTop,
        onBottom,
        onLeft,
        onRight,
        onAnimation,
        onAnimationEnd,
        onAnimationStart,
        onInterruptScroll
    }) {
        this.target = target

        this.defaultEasing = p => p
        this._easing = this.defaultEasing

        this._event = {
            onScroll,
            onTop,
            onBottom,
            onLeft,
            onRight,
            onAnimation,
            onAnimationEnd,
            onAnimationStart,
            onInterruptScroll
        }

        this._autoScroll = false
        this._frame = null
        this._lastScrollTop = this.targetElem.scrollTop
        this._lastScrollLeft = this.targetElem.scrollLeft
        this._isAnimationRunning = false

        this.target.addEventListener('scroll', event => this._scrollHandler(event))

        this.target.addEventListener('wheel', e => this._stopAnimationHandler(e))
        this.target.addEventListener('keydown', e => this._stopAnimationHandler(e))
        this.target.addEventListener('touchmove', e => this._stopAnimationHandler(e))
        this.target.addEventListener('mousedown', e => this._stopAnimationHandler(e))
    }



    get targetElem() {
        if (this.target instanceof Window || this.target instanceof Document)
            return document.scrollingElement
        return this.target
    }


    setEasing(cb) {
        this._easing = cb
    }

    getProgress(from, to, value, outside = false) {
        const max = to - from
        const user_value = value - from
        let progress = user_value / max
        if (isNaN(progress))
            progress = 0

        return outside ? progress : Math.max(Math.min(progress, 1), 0)
    }

    getValue(startWith, endWith, progress, fixed = 6) {
        return parseFloat((((endWith - startWith) * progress) + startWith).toFixed(fixed))
    }

    scrollToX(x, duration) {
        this.stopAnimation()
        const y = this.targetElem.scrollTop

        if (x instanceof HTMLElement)
            x = this._getElementPosition(x)

        if (typeof x === 'number') {
            if (duration > 0)
                this._animate(x, null, duration)
            else
                this._scrollTo(x, y)
        }
    }

    scrollToY(y, duration) {
        this.stopAnimation()
        const x = this.targetElem.scrollLeft

        if (y instanceof HTMLElement)
            y = this._getElementPosition(y)


        if (typeof y === 'number') {
            if (duration > 0)
                this._animate(null, y, duration)
            else
                this._scrollTo(x, y)
        }
    }

    scrollByX(x, duration) {
        this.stopAnimation()
        x = this.targetElem.scrollLeft + x

        if (duration > 0)
            this._animate(x, null, duration)
        else
            this._scrollBy(x, 0)
    }

    scrollByY(y, duration) {
        this.stopAnimation()
        y = this.targetElem.scrollTop + y

        if (duration > 0)
            this._animate(null, y, duration)
        else
            this._scrollBy(0, y)
    }

    scrollToBottom(duration) {
        this.scrollToY(this.targetElem.scrollHeight, duration)
    }

    scrollToTop(duration) {
        this.scrollToY(0, duration)
    }

    scrollToRight(duration) {
        this.scrollToX(this.targetElem.scrollWidth, duration)
    }

    scrollToLeft(duration) {
        this.scrollToX(0, duration)
    }

    stopAnimation() {
        cancelAnimationFrame(this._frame)
        this._trigger(this._event.onAnimationEnd)
        this._isAnimationRunning = false
    }

    getScrollObject(original) {
        let positionX = this.targetElem.scrollLeft
        let positionY = this.targetElem.scrollTop

        const scrollWidth = this.targetElem.scrollWidth
        const scrollHeight = this.targetElem.scrollHeight
        const width = this._visibleWidth
        const height = this._visibleHeight

        const maxX = scrollWidth - width
        const maxY = scrollHeight - height

        // Prevent bug on chrome when both scrollbar are visible
        if (maxY - 5 < positionY)
            positionY = Math.round(positionY)

        if (maxX - 5 < positionX)
            positionX = Math.round(positionX)

        const progressY = this.getProgress(0, maxY, positionY)
        const progressX = this.getProgress(0, maxX, positionX)
        const remainX = Math.max(0, maxX - positionX)
        const remainY = Math.max(0, maxY - positionY)


        const down = positionY > this._lastScrollTop
        const right = positionX > this._lastScrollLeft

        const sameY = positionY === this._lastScrollTop
        const sameX = positionX === this._lastScrollLeft



        const direction = {
            up: sameY ? false : !down,
            down: sameY ? false : down,
            left: sameX ? false : !right,
            right: sameX ? false : right
        }
        let text = ''
        for (const dir in direction) {
            if (direction[dir] === true)
                text = dir.toUpperCase()
        }

        direction.text = text

        return {
            original, target: this.target,
            targetElem: this.targetElem,
            autoScroll: this._autoScroll,
            isAnimationRunning: this._isAnimationRunning,
            positionX, positionY,
            scrollWidth, scrollHeight,
            maxX, maxY,
            progressX, progressY,
            remainX, remainY,
            direction
        }
    }

    simulateScroll() {
        this._scrollHandler({})
    }

    _scrollHandler(event) {
        const scrollObject = this.getScrollObject(event)
        this._trigger(this._event.onScroll, scrollObject)

        if (scrollObject.progressY >= 1)
            this._trigger(this._event.onBottom, scrollObject)

        if (scrollObject.progressY <= 0)
            this._trigger(this._event.onTop, scrollObject)

        if (scrollObject.progressX >= 1)
            this._trigger(this._event.onRight, scrollObject)

        if (scrollObject.progressX <= 0)
            this._trigger(this._event.onLeft, scrollObject)

        this._autoScroll = false
        this._lastScrollTop = Math.max(0, scrollObject.positionY)
        this._lastScrollLeft = Math.max(0, scrollObject.positionX)
    }

    _stopAnimationHandler(e) {

        if (
            ((e.type === 'keydown' && [37, 38, 39, 40].includes(e.keyCode)) ||
                (e.type === 'mousedown' &&
                    e.target.isSameNode(this.targetElem) &&
                    (!(e.clientX < this.targetElem.clientWidth) || !(e.clientY < this.targetElem.clientHeight))) ||
                (['wheel', 'touchmove'].includes(e.type))) &&
            this._isAnimationRunning
        ) {
            this.stopAnimation()
            const scrollObject = this.getScrollObject(e)
            this._trigger(this._event.onInterruptScroll, scrollObject)
        }
    }

    _animate(x, y, duration) {

        if (this._isAnimationRunning)
            this.stopAnimation()

        let start
        this._isAnimationRunning = true
        this._trigger(this._event.onAnimationStart)


        const left = this.targetElem.scrollLeft
        const top = this.targetElem.scrollTop

        x = Math.max(0, x)
        y = Math.max(0, y)

        if (typeof x !== 'number' || isNaN(x))
            x = left

        if (typeof y !== 'number' || isNaN(y))
            y = top

        const remainX = (this.targetElem.scrollWidth - this._visibleWidth) + 10
        const remainY = (this.targetElem.scrollHeight - this._visibleHeight) + 10

        if (x > remainX)
            x = remainX

        if (y > remainY)
            y = remainY


        const animation = timestamp => {
            if (!start)
                start = timestamp
            const time = timestamp - start

            const originalProgress = this.getProgress(0, duration, time)
            const progress = this._easing(originalProgress)

            let positionX = x
            let positionY = y

            if (x !== left)
                positionX = this.getValue(left, x, progress)

            if (y !== top)
                positionY = this.getValue(top, y, progress)


            const animationObject = {
                progress,
                originalProgress,
                time: Math.min(duration, time),
                duration,
                positionX,
                positionY
            }
            this._trigger(this._event.onAnimation, animationObject)

            this._scrollTo(positionX, positionY)
            this._autoScroll = true

            if (time < duration) {
                this._frame = requestAnimationFrame(animation)
            }
            else {
                this.stopAnimation()
            }
        }
        if (!(y === top && x === left)) {
            this._frame = requestAnimationFrame(animation)
        }
    }

    _scrollTo(x, y) {
        if (typeof this.targetElem.scrollTo === 'function') {
            this.targetElem.scrollTo(x, y)
        }
        else {
            this.targetElem.scrollLeft = x
            this.targetElem.scrollTop = y
        }
    }

    _scrollBy(x, y) {
        if (typeof this.targetElem.scrollBy === 'function') {
            this.targetElem.scrollBy(x, y)
        }
        else {
            this.targetElem.scrollLeft = this.targetElem.scrollLeft + x
            this.targetElem.scrollTop = this.targetElem.scrollLeft + y
        }
    }

    get _visibleHeight() {
        return Math.min(
            this.targetElem.clientHeight,
            document.documentElement.clientHeight
        )
    }

    get _visibleWidth() {
        return Math.min(
            this.targetElem.clientHeight,
            document.documentElement.clientHeight
        )
    }

    _getElementPosition(element) {
        const elemTop = element.getBoundingClientRect().top + document.scrollingElement.scrollTop
        const targetTop = this.targetElem.getBoundingClientRect().top + document.scrollingElement.scrollTop

        if (this.targetElem === document.scrollingElement)
            return (elemTop - targetTop)
        return ((elemTop + this.targetElem.scrollTop) - targetTop)
    }

    _trigger(cb, ...data) {
        if (typeof cb === 'function')
            cb.call(this, ...data)
    }
}


module.exports = Scroll