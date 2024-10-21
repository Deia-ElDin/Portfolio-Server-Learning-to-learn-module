const Job = require("../models/Job");
const { BadRequestError, NotFoundError, ConflictError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({});
  console.log("jobs", jobs);

  res.status(200).json({ data: jobs });
};

const createJob = async (req, res) => {
  const { jobTitle, startingDate, finishingDate } = req.body;

  const existedJob = await Job.findOne({
    jobTitle,
    startingDate,
    finishingDate,
  }).exec();

  if (existedJob) throw new ConflictError("Job already exist");

  const createdJob = await Job.create(req.body);
  res
    .status(201)
    .json({ msg: `Job: ${createdJob.jobTitle} created`, data: createdJob });
};

const updatedJob = async (req, res) => {
  const jobId = req.params.id;
  const {
    countryName,
    countrySVGLink,
    CountryFlag,
    companyName,
    jobTitle,
    jobDescription,
    startingDate,
    finishingDate,
  } = req.body;

  if (
    !countryName &&
    !countrySVGLink &&
    !CountryFlag &&
    !companyName &&
    !jobTitle &&
    !jobDescription &&
    !startingDate &&
    !finishingDate
  )
    throw new BadRequestError("You can't submit an empty form!");

  const query = { _id: jobId };

  const updates = {};
  if (countryName) updates.countryName = countryName;
  if (countrySVGLink) updates.countrySVGLink = countrySVGLink;
  if (CountryFlag) updates.CountryFlag = CountryFlag;
  if (companyName) updates.companyName = companyName;
  if (jobTitle) updates.jobTitle = jobTitle;
  if (jobDescription) updates.jobDescription = jobDescription;
  if (startingDate) updates.startingDate = startingDate;
  if (finishingDate) updates.finishingDate = finishingDate;

  const options = { new: true, runValidators: true };

  const updatedJob = await Job.findOneAndUpdate(query, updates, options);

  if (!updatedJob)
    throw new NotFoundError(`You don't have a job with the id = ${jobId}`);

  res
    .status(200)
    .json({ msg: `Job: ${updatedJob.jobTitle} updated`, data: updatedJob });
};

const deleteJob = async (req, res) => {
  const jobId = req.params.id;

  const deletedJob = await Job.findOneAndDelete({ _id: jobId });

  if (!deletedJob)
    throw new NotFoundError(`You don't have a job with the id = ${jobId}`);

  res.status(200).json({ msg: "Job Removed" });
};

module.exports = {
  getAllJobs,
  createJob,
  updatedJob,
  deleteJob,
};
