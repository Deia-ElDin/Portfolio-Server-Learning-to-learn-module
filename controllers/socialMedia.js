const SocialMedia = require('../models/SocialMedia');
const { BadRequestError, NotFoundError, ConflictError } = require('../errors');

const getAllSocialMedias = async (req, res) => {
  const socialMedias = await SocialMedia.find({});
  res.status(200).json({ data: socialMedias });
};

const createSocialMedia = async (req, res) => {
  const { name } = req.body;

  const existedSocialMedia = await SocialMedia.findOne({ name }).exec();

  if (existedSocialMedia) throw new ConflictError('Social media already exist');

  const createdSocialMedia = await SocialMedia.create(req.body);

  res.status(201).json({
    msg: `Social Media: ${createdSocialMedia.name} created`,
    data: createdSocialMedia,
  });
};

const updateSocialMedia = async (req, res) => {
  const socialMediaId = req.params.id;
  const { name, svgLink, link } = req.body;

  if (!name && !svgLink && !link)
    throw new BadRequestError("You can't submit an empty form!");

  const updates = {};
  if (name) updates.name = name;
  if (svgLink) updates.svgLink = svgLink;
  if (link) updates.link = link;

  const query = { _id: socialMediaId };
  const options = { new: true, runValidators: true };

  const updatedSocialMedia = await SocialMedia.findOneAndUpdate(
    query,
    updates,
    options
  );

  if (!updatedSocialMedia)
    throw new NotFoundError(
      `You don't have a social media with the id = ${socialMediaId}`
    );

  res.status(200).json({
    msg: `Social Media: ${updatedSocialMedia.name} updated`,
    data: updatedSocialMedia,
  });
};

const deleteSocialMedia = async (req, res) => {
  const socialMediaId = req.params.id;

  const deletedSocialMedia = await SocialMedia.findOneAndDelete({
    _id: socialMediaId,
  });

  if (!deletedSocialMedia)
    throw new NotFoundError(
      `You don't have a social media with the id = ${socialMediaId}`
    );

  res.status(200).json({ msg: 'Social Media Removed' });
};

module.exports = {
  getAllSocialMedias,
  createSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
};
