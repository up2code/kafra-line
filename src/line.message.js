module.exports = {
    createTextMessage: text => (
        { type: 'text', text }
    ),
    createImageMessage: (originalContentUrl, previewImageUrl) => (
        { type: 'image', originalContentUrl, previewImageUrl}
    )
}