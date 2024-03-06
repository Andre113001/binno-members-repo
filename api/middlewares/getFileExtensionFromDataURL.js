/**
 * Extracts and returns the file extension from a data URL.
 *
 * @function
 * @param {string} dataURL - The data URL from which to extract the file extension.
 * @returns {string|null} Returns the file extension if found, or null if not found.
 */
function getFileExtensionFromDataURL(dataURL) {
    const match = dataURL.match(/^data:image\/([a-zA-Z+]+);base64,/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

module.exports = {
	getFileExtensionFromDataURL
}
