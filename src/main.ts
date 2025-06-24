import '@fontsource-variable/quicksand/wght.css'
import './reset.css'
import './style.css'
import words from 'an-array-of-english-words'

const form = document.querySelector('form') as HTMLFormElement
const list = document.getElementById('result') as HTMLOListElement
const alert = document.getElementById('alert') as HTMLParagraphElement
const sorting = document.getElementById('sorting') as HTMLSelectElement

/**
 * Filters the list of words to those that
 *  1. Are at least as long as the given length
 *  2. Contain the given required letter, if any
 *  3. Only contain letters from the given set of letters
 */
const getWords = (
    letters: Array<string>,
    length: number,
    requiredLetter: string | null = null
): Array<string> => {
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
 */
const onFormSubmit = (event: SubmitEvent) => {
    list.innerHTML = ''
    alert.textContent = ''
    event.preventDefault()

    const formData = new FormData(form)

    const letters = Array.from(formData.get('letters') as string)
    const length = parseInt(formData.get('length') as string) || 3
    const requiredLetter = formData.get('required-letter') as string | null

    const result = getWords(letters, length, requiredLetter)
    if (result.length === 0) {
        alert.textContent = `No words found with the given parameters`
    } else {
        list.innerHTML = result.map((word) => `<li>${word}</li>`).join('')
    }
}

/**
 * Sorts the list of words displayed on the page based on the selected sorting option.
 */
const sort = (event: Event) => {
    const target = event.target as HTMLSelectElement
    const sortBy = target.value
    const listItems = Array.from(list.children)
    listItems.sort((a, b) => {
        const aText = a.textContent || ''
        const bText = b.textContent || ''
        if (sortBy === 'alphabetical-asc') {
            return aText.localeCompare(bText)
        } else if (sortBy === 'alphabetical-desc') {
            return bText.localeCompare(aText)
        } else if (sortBy === 'length-asc') {
            return aText.length - bText.length
        } else if (sortBy === 'length-desc') {
            return bText.length - aText.length
        }
        return 0
    })
    list.innerHTML = listItems.map((item) => item.outerHTML).join('')
}

form.addEventListener('submit', onFormSubmit)
sorting.addEventListener('change', sort)
