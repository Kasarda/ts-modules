/**! @license
  * router.tsx
  *
  * @name Router
  * @name Routes
  * @name Link
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

/**
 *
 * @module router
 *
 * This module includes Hash routing components
 */


import * as React from 'react'



/**
 *
 * Hash Routing
 *
 */

const getPath = (): string => location.hash.replace('#', '')
const isValidPath = (path: any): any => (typeof path === 'string' && getPath() === path) || (path instanceof RegExp && getPath().match(path))

const title_elem: any = document.querySelector('title')
const default_title: string = title_elem.innerHTML
const setTitle = (title: string): any => title_elem.innerHTML = title || default_title

export class Router {

    constructor(scope: any) {
        scope.state = scope.state || {}
        scope.state.path = getPath()

        window.addEventListener('hashchange', function (event) {
            scope.setState({ path: getPath() })
            if (typeof scope.onHashChange === 'function')
                scope.onHashChange.call(scope, event)
        })
    }

    static getPath() { return getPath() }

    static redirect(hash: any, redirectTo?: string) {

        if (isValidPath(hash) && typeof redirectTo === 'string')
            location.hash = redirectTo
        else if (typeof hash === 'string' && typeof redirectTo !== 'string')
            location.hash = hash

    }

    static render(templates: any[], notFound: any) {
        let template: any
        templates.forEach(temp => {
            if (!template && isValidPath(temp.props.path))
                template = temp
        })

        if (template)
            setTitle(template.props.title)
        else if (notFound)
            setTitle(notFound.props.title)

        return template || notFound
    }

}

export function Routes({ children }: any) {

    const childs: any[] = children instanceof Array ? children : [children]
    const notFound: any = childs.filter(temp => temp.props.notFound)[0]
    return Router.render(childs, notFound)
}

export function Link(props: any) {

    let className: string = ''
    if (isValidPath(props.path))
        className = props.className as string || 'active'

    return props.children
}
