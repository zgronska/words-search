import words from 'an-array-of-english-words'

const form = document.querySelector('form')
const list = document.getElementById('result')
const alert = document.getElementById('alert')

const getWords = (letters, length, requiredLetter = null) => {
    return words
        .filter((word) => word.length >= length)
        .filter((word) =>
            requiredLetter ? word.includes(requiredLetter) : true
        )
        .filter((word) => letters.every((letter) => word.includes(letter)))
}

const onFormSubmit = (event) => {
    list.innerHTML = ''
    alert.textContent = ''
    event.preventDefault()
    const formData = new FormData(form)

    const letters = Array.from(formData.get('letters'))
    const length = formData.get('length') || 3
    const requiredLetter = formData.get('required-letter')

    const result = getWords(letters, length, requiredLetter)
    if (result.length === 0) {
        alert.textContent = `No words found with the given parameters`
    } else {
        list.innerHTML = result.map((word) => `<li>${word}</li>`).join('')
    }
}

form.addEventListener('submit', onFormSubmit)
