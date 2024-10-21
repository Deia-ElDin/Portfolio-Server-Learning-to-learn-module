const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const Profile = require('../models/Profile');
const { NotFoundError, BadRequestError } = require('../errors');

const getProfilePic = async (req, res) => {
  const profilePic = await Profile.find({});
  res.status(200).json({ data: profilePic });
};

const createProfilePic = async (req, res) => {
  if (!req?.file) throw new BadRequestError('Must provide the profile Image');

  if (req?.file) {
    const img = path.join(__dirname, '..', 'uploads', `${req.file.filename}`);
    req.file.profilePic = {
      data: fs.readFileSync(img),
      contentType: req.file.mimetype,
    };
    await fsPromises.unlink(img);
  }

  const createdProfilePic = await Profile.create(req.file);

  res.status(201).json({
    msg: `Image created`,
    data: createdProfilePic,
  });
};

const updateProfilePic = async (req, res) => {
  const reqBody = JSON.parse(req.body.profileObj);
  const profilePicId = reqBody.id;

  if (!req?.file) throw new BadRequestError('Must provide the profile Image');

  const updates = {};
  if (req?.file) {
    const img = path.join(__dirname, '..', 'uploads', `${req.file.filename}`);
    updates.profilePic = {
      data: fs.readFileSync(img),
      contentType: req.file.mimetype,
    };
    await fsPromises.unlink(img);
  }

  const query = { _id: profilePicId };
  const options = { new: true, runValidators: true };

  const updatedImg = await Profile.findOneAndUpdate(query, updates, options);

  if (!updatedImg)
    throw new NotFoundError(
      `You don't have an image with the id = ${profilePicId}`
    );

  res.status(200).json({
    msg: `Image updated`,
    data: updatedImg,
  });
};

module.exports = {
  getProfilePic,
  createProfilePic,
  updateProfilePic,
};
