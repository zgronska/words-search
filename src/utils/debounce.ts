const debounce = (fn: Function, delay: number = 500) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay)
    }
}

export default debounce
