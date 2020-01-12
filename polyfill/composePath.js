/**
  *
  * -> Polyfill for composedPath in Event Object
*/

if (!('composedPath' in Event.prototype) || typeof Event.prototype.composedPath !== 'function') {
    Event.prototype.composedPath = function composedPath() {
        if (this.path)
            return this.path

        const element = this.target || null
        const pathList = [element]

        if (!element || !element.parentElement)
            return []

        while (element.parentElement) {
            element = element.parentElement
            pathList.unshift(element)
        }

        return pathList
    }
}