const Contact = require("../models/Contact");
const { BadRequestError, NotFoundError, ConflictError } = require("../errors");

const getAllContacts = async (req, res) => {
  const contacts = await Contact.find({});
  res.status(200).json({ data: contacts });
};

const createContact = async (req, res) => {
  const { name } = req.body;

  const existedContact = await Contact.findOne({ name }).exec();
  if (existedContact) throw new ConflictError("Contact already exist");

  const createdContact = await Contact.create(req.body);
  res.status(201).json({
    msg: `Contact: ${createdContact.name} created`,
    data: createdContact,
  });
};

const updateContact = async (req, res) => {
  const contactId = req.params.id;
  const { name, svgLink, info } = req.body;

  if (!name && !svgLink && !info)
    throw new BadRequestError("You can't submit an empty form!");

  const updates = {};
  if (name) updates.name = name;
  if (svgLink) updates.svgLink = svgLink;
  if (info) updates.info = info;

  const query = { _id: contactId };
  const options = { new: true, runValidators: true };

  const updatedContact = await Contact.findOneAndUpdate(
    query,
    updates,
    options
  );

  if (!updatedContact)
    throw new NotFoundError(
      `You don't have a contact with the id = ${contactId}`
    );

  res.status(200).json({
    msg: `Contact: ${updatedContact.name} updated`,
    data: updatedContact,
  });
};

const deleteContact = async (req, res) => {
  const contactId = req.params.id;

  const deletedContact = await Contact.findOneAndDelete({ _id: contactId });

  if (!deletedContact)
    throw new NotFoundError(
      `You don't have a Contact with the id = ${contactId}`
    );

  res.status(200).json({ msg: "Contact Removed" });
};

module.exports = {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
};
