const FileListener = require('../fileListener')

const btn: any = document.querySelector('#open')

const file = new FileListener({
    accept: '*',
    size: 3000000,
    drop: document.querySelectorAll('input, button'),
    multiple: true
})

btn.addEventListener('click', () => {
    file.open()
})

file.on('change', (event: any) => {
    file.trigger('error', { ...event, message: 'custom error' })
})

file.on('error', (event: any) => {
    console.log(event)
})
