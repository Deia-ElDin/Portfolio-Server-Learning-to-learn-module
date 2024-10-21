const Skill = require('../models/Skill');
const { BadRequestError, NotFoundError, ConflictError } = require('../errors');

const getAllSkills = async (req, res) => {
  const skills = await Skill.find({});
  res.status(200).json({ data: skills });
};

const createSkill = async (req, res) => {
  const { name, percentage } = req.body;

  const existedSkill = await Skill.findOne({ name }).exec();

  if (existedSkill) throw new ConflictError('Skill already exist');

  if (isNaN(percentage))
    throw new BadRequestError('Percentage must be a number');

  const createdSkill = await Skill.create(req.body);

  res.status(201).json({
    msg: `Skill: ${createdSkill.name} created`,
    data: createdSkill,
  });
};

const updateSkill = async (req, res) => {
  const skillId = req.params.id;
  const { name, svgLink, percentage } = req.body;

  if (!name && !svgLink && !percentage)
    throw new BadRequestError("You can't submit an empty form!");

  if (isNaN(percentage))
    throw new BadRequestError('Percentage must be a number');

  const updates = {};
  if (name) updates.name = name;
  if (svgLink) updates.svgLink = svgLink;
  if (percentage) updates.percentage = percentage;

  const query = { _id: skillId };
  const options = { new: true, runValidators: true };

  const updatedSkill = await Skill.findOneAndUpdate(query, updates, options);

  if (!updatedSkill)
    throw new NotFoundError(`You don't have a skill with the id = ${skillId}`);

  res.status(200).json({
    msg: `Skill: ${updatedSkill.name} updated`,
    data: updatedSkill,
  });
};

const deteleSkill = async (req, res) => {
  const skillId = req.params.id;

  const deletedSkill = await Skill.findOneAndDelete({ _id: skillId });

  if (!deletedSkill)
    throw new NotFoundError(`You don't have a skill with the id = ${skillId}`);

  res.status(200).json({ msg: 'Skill Removed' });
};

module.exports = {
  getAllSkills,
  createSkill,
  updateSkill,
  deteleSkill,
};
