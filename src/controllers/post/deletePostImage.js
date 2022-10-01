const { deleteImage } = require("../../utils/deleteCloudinaryImage");

exports.deleteCloudinaryImage = async (req, res, next) => {
    try {
        const imageId = req.params.imageId;
        const deleteImageResponse = await deleteImage(imageId);

        res.send({ ...deleteImageResponse });
    } catch (error) {
        next(error)
    }
}