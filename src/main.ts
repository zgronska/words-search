import '@fontsource-variable/quicksand/wght.css'
import './reset.css'
import './style.css'
import words from 'an-array-of-english-words'
import debounce from './utils/debounce'

const form = document.querySelector('form') as HTMLFormElement
const list = document.getElementById('result') as HTMLOListElement
const alert = document.getElementById('alert') as HTMLParagraphElement
const sorting = document.getElementById('sorting') as HTMLSelectElement
const submit = document.querySelector('button') as HTMLButtonElement

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
        sort(sorting.value)
    }
}

/**
 * Sorts the list of words displayed on the page based on the selected sorting option.
 */
const sort = (sortBy: string) => {
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

/**
 * Checks if the given input element has an error.
 */
const hasError = (
    input: HTMLInputElement,
    updateValidation: boolean = false
): boolean => {
    const value = input.value
    const id = input.id

    const validationEl = input.parentElement?.querySelector(
        '[data-validation]'
    ) as HTMLElement

    if (!value) {
        if (updateValidation) {
            validationEl.textContent = input.required ? 'Field is required' : ''
        }
        return input.required
    }

    const mapping = {
        'letters': {
            regex: /^[a-zA-Z]+$/,
            message: 'Enter only letters (a-z)'
        },
        'length': {
            regex: /^(?:[3-9]|\d{2,}|\d{1}[0-9])$/,
            message: 'The length must be a number greater than or equal 3'
        },
        'required-letter': {
            regex: /^[a-zA-Z]$/,
            message: 'Enter only one letter (a-z)'
        }
    }

    const error = !mapping[id as keyof typeof mapping].regex.test(value)

    if (updateValidation) {
        validationEl.textContent = error
            ? mapping[id as keyof typeof mapping].message
            : ''
    }

    return error
}

form.addEventListener('submit', onFormSubmit)
form.addEventListener(
    'input',
    debounce(function (e: Event) {
        let isFormValid =
            Array.from(form.querySelectorAll('input')).filter(
                (input) => input !== e.target && hasError(input)
            ).length === 0

        if (hasError(e.target as HTMLInputElement, true)) {
            isFormValid = false
        }

        submit.disabled = !isFormValid
    })
)
sorting.addEventListener('change', (e: Event) => sort(e?.target?.value))
