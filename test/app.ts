const Elem = require('../common/elem')
const $ = (...s: any) => new Elem(...s)

Elem.plugin({
    setColor() {
        return (color: string) => {
            this.target.forEach((target: any) => {
                target.style.color = color
            })
        }
    }
})


const $body = $('body', window)
console.log($body)
$body.on('click', () => {
    $body.setColor('red')
    console.log($body)
})