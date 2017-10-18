/**! @license
 * 
 * @name React
 * @name ReactDOM
 * 
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */



/**
 * 
 * @module react
 * 
 * Includes refference to @var React and @var ReactDOM
 * This module includes Hash routing components
 */

import * as React from 'react'
import * as ReactDOM from 'react-dom'


/**
 * 
 * Export dependencies
 * 
 */
export { React }
export { ReactDOM }







/**! @license
  * react.tsx
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
 * HashRouting
 * 
 */


function getHash(): string {
    return location.hash.replace('#', '')
}

function isValidPath(path: any): any {
    return (typeof path === 'string' && getHash() === path) || (path instanceof RegExp && getHash().match(path))
}

export class Router {

    constructor(scope: any) {
        scope.state = scope.state || {}
        scope.state.path = getHash()
        onhashchange = e => {
            scope.setState({ path: getHash() })
            if (typeof scope.onHashChange === 'function')
                scope.onHashChange.call(scope, getHash(), e)
        }
    }


    static getHash: () => string = getHash

    static redirect(hash: any, redirectTo?: string): void {
        if (typeof redirectTo === 'string' && isValidPath(hash))
            location.hash = redirectTo
        else if (typeof hash === 'string')
            location.hash = hash
    }


    static render(templates: any[], notFound: any): any {
        let template: any
        templates.forEach(temp => {
            if (!template && isValidPath(temp.props.path))
                template = temp
        })

        return template || notFound
    }

}






export class Routes extends React.Component<any, any>{

    render() {
        const children: any = this.props.children
        const childs: any[] = children instanceof Array ? children : [children]
        const notFound: any[] = children.filter((temp: any) => temp.props.notFound)
        return (
            <outlet-component>
                {Router.render(childs, notFound)}
            </outlet-component>
        )
    }
}


export class Link extends React.Component<any, any> {

    render() {
        let className: string = ''
        const def_className: string = 'active'

        if (isValidPath(this.props.path))
            className = this.props.active || def_className

        return (
            <hash-link class={className}>
                {this.props.children}
            </hash-link>
        )
    }
}


/**
 * 
 * @name HashRouting
 * 
 * import {..., Router, Routes, Link}
 * 
 * class AppComponent extends React.Component<any, any>{
 *  constructor(){
 *      ...
 *      new Router(this) -> create event listener on hash change, update this.state.path on every hash change and trigger method onHashChange
 *  }
 * 
 *  onHashChange(newHash, event){
 *   -> 'this' is AppComponent not Window
 * }
 * 
 * render(){
 *  Router.redirect('home', '') -> if hash will be home, location will be updated to '' hash
 * 
 *  return (
 *      <div id="app">
 *          
 *          <Routes>
 *              <Home path={/^home|main|$/}/>
 *              <About path='about'/>
 *              <NotFound notFound />
 *          <Routes/>
 * 
 *       
 *          <Link path={/^(home|)$/}><a href="#home"> Home </a></Link>
 *          <Link path="about" active="someDifClass"><a href="#about"> About </a></Link>
 *          <Link path="contact"><a href="#contact"> Contact </a></Link>
 *          
 *          -> if [path] match location.hash this link will be has class from [active] or by default .active
 *  
 *      </div>
 *  )
 * }
 * }
 * 
 */