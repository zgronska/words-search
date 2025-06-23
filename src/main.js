const form = document.querySelector('form')
const list = document.getElementById('result')

const getWords = (letters, length, requiredLetter = null) => {
    return ['word1', 'word2', 'word3']
}

const onFormSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(form)

    const letters = Array.from(formData.get('letters'))
    const length = formData.get('length')
    const requiredLetter = formData.get('required-letter')

    const result = getWords(letters, length, requiredLetter)
    list.innerHTML = result.map((word) => `<li>${word}</li>`).join('')
}

form.addEventListener('submit', onFormSubmit)
