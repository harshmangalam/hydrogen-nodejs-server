const cloudinary = require('cloudinary');
const { CLOUDINARY_CONFIG } = require("../config/env.config");

cloudinary.config(CLOUDINARY_CONFIG); // load cloudinary configs

const deleteImage = async (imageId) => {
    return cloudinary.v2.uploader.destroy(imageId)
        .then(response => response)
        .catch(error => {
            throw new Error(error)
        });
}

module.exports = {
    deleteImage
}