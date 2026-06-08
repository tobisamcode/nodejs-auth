const Image = require("../models/image.model");
const { uploadToCloudinary } = require("../helpers/cloudinary.helper");
const cloudinary = require("../config/cloudinary.config");
const fs = require("fs");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded, Please upload an Image",
      });
    }

    // upload image to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // store image details in the database
    const newImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newImage.save();

    // delete the local file after uploading to cloudinary
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      }
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong, please try again later",
    });
  }
};

const fetchImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: images,
      meta: {
        currentPage: page,
        totalPages,
        totalImages,
      },
    });
  } catch (error) {
    console.log("Error fetching images:", error);

    res.status(500).json({
      success: false,
      error: "Something went wrong, please try again later",
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.userInfo;

    console.log("Image ID to delete:", id);
    const currentImage = await Image.findById(id);

    if (!currentImage) {
      return res.status(404).json({ success: false, error: "Image not found" });
    }

    // Check if the user is the owner of the image
    if (currentImage.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "you are not the owner of this image, and so cannot delete it",
      });
    }

    // first delete the image from cloudinary
    await cloudinary.uploader.destroy(currentImage.publicId);

    // delete the image from the database
    await Image.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.log("Error fetching images:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong, please try again later",
    });
  }
};

module.exports = {
  uploadImage,
  fetchImages,
  deleteImage,
};
