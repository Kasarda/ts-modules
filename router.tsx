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
 * This module includes Hash routing for react
 */


import * as React from 'react'



/**
 *
 * Hash Routing
 *
 */

const getPath = (): string => location.hash.replace('#', '')
const isValidPath = (path: any): any => (typeof path === 'string' && getPath() === path) || (path instanceof RegExp && getPath().match(path))
const returnArray = (obj: any): any[] => obj instanceof Array ? obj : [obj]
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

    static getPath(): string { return getPath() }

    static redirect(hash: any, redirectTo?: string): void {

        if (isValidPath(hash) && typeof redirectTo === 'string')
            location.hash = redirectTo
        else if (typeof hash === 'string' && typeof redirectTo !== 'string')
            location.hash = hash

    }

    static render(templates: any[], notFound: any): any {
        let template: any
        templates.forEach(temp => {
            if (!template && isValidPath(temp.props.path))
                template = temp
        })

        if (template)
            setTitle(template.props.title)
        else if (notFound)
            setTitle(notFound.props.title)
        else
            setTitle(default_title)


        return template || notFound
    }

}

export function Routes({ children }: any): any {

    const childs: any[] = returnArray(children)
    const notFound: any = childs.filter(temp => temp.props.notFound)[0]
    return Router.render(childs, notFound) || ''
}

export function Link({ children, path, className }: any): any {

    let activeClass: string = ''
    if (isValidPath(path))
        activeClass = className as string || 'active'

    const childs = returnArray(children)
    return (
        <router-link class={activeClass}>
            {childs}
        </router-link>
    )
}
