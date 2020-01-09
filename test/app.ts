import Validation from '../validate'

const btn: any = document.querySelector('button')
const form: any = document.querySelector('form')


const validation = new Validation({
    text: {
        min: 4
    }
})


btn.addEventListener('click', () => {

})

validation.on('validate', (e: any) => {
    for (const name in e.controllers) {
        const state = e.controllers[name]
        if (state.valid) {
            state.scheme.ref.parentElement.querySelector('span').innerHTML = ''
            state.scheme.ref.style.background = 'green'
        }
        else {
            state.scheme.ref.parentElement.querySelector('span').innerHTML = state.message
            state.scheme.ref.style.background = 'red'
        }
    }
})