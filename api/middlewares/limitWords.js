/**
 * Limits the number of words in a given text.
 *
 * @function
 * @param {string} text - The input text to limit the words.
 * @param {number} limit - The maximum number of words to retain.
 * @returns {string} Returns a new string with the specified limit of words.
 */
function limitWords(text, limit) {
    const words = text.split(' ')
    const limitedWords = words.slice(0, limit)
    return limitedWords.join(' ')
}

module.exports = {
	limitWords
}
