import '@fontsource-variable/quicksand'
import './reset.css'
import './style.css'
import words from 'an-array-of-english-words'

const form = document.querySelector('form')
const list = document.getElementById('result')
const alert = document.getElementById('alert')
const sorting = document.getElementById('sorting')

/**
 * Filters the list of words to those that
 *  1. Are at least as long as the given length
 *  2. Contain the given required letter, if any
 *  3. Only contain letters from the given set of letters
 *
 * @param {string} letters The set of allowed letters
 * @param {number} length The minimum length of the words
 * @param {string?} requiredLetter A letter the words must contain
 * @returns {string[]} The filtered list of words
 */
const getWords = (letters, length, requiredLetter = null) => {
    const allowedLetters = new Set([...letters, requiredLetter].filter(Boolean))
    return words
        .filter((word) => word.length >= length)
        .filter((word) =>
            requiredLetter ? word.includes(requiredLetter) : true
        )
        .filter((word) => [...word].every((char) => allowedLetters.has(char)))
}

/**
 * Handles the form submission
 *
 * @param {Event} event The submit event
 *
 * @returns {void}
 */
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

/**
 * Sorts the list of words displayed on the page based on the selected sorting option.
 *
 * @param {Event} event The change event triggered by selecting a sorting option.
 */
const sort = (event) => {
    const sortBy = event.target.value
    const listItems = Array.from(list.children)
    listItems.sort((a, b) => {
        if (sortBy === 'alphabetical-asc') {
            return a.textContent.localeCompare(b.textContent)
        } else if (sortBy === 'alphabetical-desc') {
            return b.textContent.localeCompare(a.textContent)
        } else if (sortBy === 'length-asc') {
            return a.textContent.length - b.textContent.length
        } else if (sortBy === 'length-desc') {
            return b.textContent.length - a.textContent.length
        }
    })
    list.innerHTML = listItems.map((item) => item.outerHTML).join('')
}

form.addEventListener('submit', onFormSubmit)
sorting.addEventListener('change', sort)
