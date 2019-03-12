module.exports = {
    createTextMessage: text => (
        { type: 'text', text }
    ),
    createImageMessage: (originalContentUrl, previewImageUrl) => (
        { type: 'image', originalContentUrl, previewImageUrl}
    ),
    createMultipleImagesMessage: imageUrls => {
        return imageUrls.map(url => {
            return { type: 'image', url: url};
        });
    }
}