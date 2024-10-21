const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const Project = require('../models/Project');
const { BadRequestError, NotFoundError, ConflictError } = require('../errors');

const getAllProjects = async (req, res) => {
  const {
    sort,
    projectName,
    version,
    rating,
    commercial,
    responsive,
    frontEnd,
    backEnd,
    fullStack,
    technologies,
    testedWith,
    duration,
    year,
  } = req.query;

  const queryObj = {};
  let techRegexArray = [];
  let testRegexArray = [];

  if (projectName) {
    queryObj.projectName = version
      ? { $regex: `${projectName}-${version}`, $options: 'i' }
      : { $regex: projectName, $options: 'i' };
  }
  if (rating || duration) {
    const handleNumericFilters = (input) => {
      const fixedInput = input.replace('&lt;', '<');
      const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
      };

      const regExp = /\b(>=|>|=|<|<=)\b/g;

      let filters = fixedInput.replace(
        regExp,
        (match) => `-${operatorMap[match]}-`
      );

      const count = filters
        .split('-')
        .filter((item) => item.includes('$')).length;

      const letters = ['r', 'd'];

      if (count === 1) {
        let [field, operator, value] = filters.split('-');
        if (letters.includes(field)) {
          const property = field === 'r' ? 'rating' : 'duration';
          queryObj[property] = { [operator]: Number(value) };
        }
      } else {
        filters = filters.split(',');
        let [field, operator1, min] = filters[0].split('-');
        let [field2, operator2, max] = filters[1].split('-');

        if (letters.includes(field)) {
          const property = field === 'r' ? 'rating' : 'duration';
          queryObj[property] = {
            [operator1]: Number(min),
            [operator2]: Number(max),
          };
        }
      }
    };

    if (rating) handleNumericFilters(rating);
    if (duration) handleNumericFilters(duration);
  }
  if (technologies) {
    techRegexArray = JSON.parse(technologies).map((tech) => ({
      technologies: { $regex: tech },
    }));
  }
  if (testedWith) {
    testRegexArray = JSON.parse(testedWith).map((browser) => ({
      testedWith: { $regex: browser },
    }));
  }
  if (year) {
    const cuurentYear = new Date(year);
    const nextYear = new Date(String(Number(year) + 1));
    queryObj.createdAt = { $gte: cuurentYear, $lt: nextYear };
  }
  if (commercial) queryObj.commercial = commercial;
  if (responsive) queryObj.responsive = responsive;
  if (frontEnd) {
    queryObj.ui = frontEnd === 'true' ? true : false;
    queryObj.server = false;
  }
  if (backEnd) {
    queryObj.server = backEnd === 'true' ? true : false;
    queryObj.ui = false;
  }
  if (fullStack) {
    queryObj.ui = fullStack === 'true' ? true : false;
    queryObj.server = fullStack === 'true' ? true : false;
  }

  const setSearchObj = () => {
    let searchArray = [];
    const userSeekingTechs = techRegexArray.length >= 1;
    const userSeekingTests = testRegexArray.length >= 1;

    if (userSeekingTechs || userSeekingTests) {
      const queryArray = Object.entries(queryObj).map(([query, value]) => ({
        [query]: value,
      }));

      if (userSeekingTechs) searchArray.push(...techRegexArray);
      if (userSeekingTests) searchArray.push(...testRegexArray);
      if (queryArray.length >= 1) searchArray.push(...queryArray);

      return { $and: searchArray };
    } else return queryObj;
  };

  const searchObj = setSearchObj();

  let result = Project.find(searchObj);

  if (sort) {
    let sortString;
    if (sort.includes(',')) sortString = sort.split(',').join(' ');
    else sortString = sort;
    result = result.sort(sortString);
  } else {
    result = result.sort('-createdAt');
  }

  const projects = await result;

  res.status(200).json({ data: projects });
};

const createProject = async (req, res) => {
  const reqBody = JSON.parse(req.body.projectObj);

  const { projectName, rating, technologies, startingDate, finishingDate } =
    reqBody;

  const existedProject = await Project.findOne({ projectName }).exec();

  if (existedProject) throw new ConflictError('Project already exist');

  if (
    !projectName &&
    !rating &&
    !req?.file &&
    !technologies &&
    !startingDate &&
    !finishingDate
  ) {
    throw new BadRequestError("You can't submit an empty form!");
  }

  if (!req?.file) throw new BadRequestError('Must provide the project image');

  if (isNaN(rating)) throw new BadRequestError('Rating must be a number');

  if (req?.file) {
    const img = path.join(__dirname, '..', 'uploads', `${req.file.filename}`);
    reqBody.projectImg = {
      data: fs.readFileSync(img),
      contentType: req.file.mimetype,
    };
    await fsPromises.unlink(img);
  }

  const createdProject = await Project.create(reqBody);

  res.status(201).json({
    msg: `Project: ${createdProject.projectName} created`,
    data: createdProject,
  });
};

const updateProject = async (req, res) => {
  const reqBody = JSON.parse(req.body.projectObj);
  const projectId = reqBody.id;

  if (req.file) reqBody.projectImg = true;

  const {
    projectName,
    rating,
    commercial,
    responsive,
    projectImg,
    technologies,
    uiLiveDemoLink,
    uiDownloadLink,
    uiPackageJson,
    serverLiveDemoLink,
    serverDownloadLink,
    serverPackageJson,
    testedWith,
    startingDate,
    finishingDate,
  } = reqBody;

  if (
    !projectName &&
    !rating &&
    !`${commercial}` &&
    !`${responsive}` &&
    !projectImg &&
    !technologies &&
    !uiLiveDemoLink &&
    !uiDownloadLink &&
    !uiPackageJson &&
    !serverLiveDemoLink &&
    !serverDownloadLink &&
    !serverPackageJson &&
    !testedWith &&
    !startingDate &&
    !finishingDate
  )
    throw new BadRequestError("You can't submit an empty form!");

  if (rating && isNaN(rating))
    throw new BadRequestError('Rating must be a number');

  const updates = {};
  if (projectName) updates.projectName = projectName;
  if (rating) updates.rating = rating;
  if (projectImg) {
    const img = path.join(__dirname, '..', 'uploads', `${req.file.filename}`);
    updates.projectImg = {
      data: fs.readFileSync(img),
      contentType: req.file.mimetype,
    };
    await fsPromises.unlink(img);
  }
  updates.commercial = commercial;
  updates.responsive = responsive;
  if (technologies) {
    let sum = 0;
    const technologiesObj = JSON.parse(technologies);
    Object.values(technologiesObj).map((value) => (sum += value));
    updates.sumCodeLines = sum;
    updates.technologies = technologies;
  }
  if (uiLiveDemoLink || uiDownloadLink || uiPackageJson) {
    updates.ui = true;
  }
  if (uiLiveDemoLink) updates.uiLiveDemoLink = uiLiveDemoLink;
  if (uiDownloadLink) updates.uiDownloadLink = uiDownloadLink;
  if (uiPackageJson) updates.uiPackageJson = uiPackageJson;
  if (serverLiveDemoLink || serverDownloadLink || serverPackageJson) {
    updates.server = true;
  }
  if (serverLiveDemoLink) updates.serverLiveDemoLink = serverLiveDemoLink;
  if (serverDownloadLink) updates.serverDownloadLink = serverDownloadLink;
  if (serverPackageJson) updates.serverPackageJson = serverPackageJson;
  if (testedWith) updates.testedWith = testedWith;

  if (startingDate || finishingDate) {
    const requiredProject = await Project.findOne({ _id: projectId }).exec();
    const oldStartingDate = requiredProject.startingDate;
    const oldFinishingDate = requiredProject.finishingDate;
    const newStartingDate = startingDate ? startingDate : oldStartingDate;
    const newFinishingDate = finishingDate ? finishingDate : oldFinishingDate;
    const date1 = new Date(newStartingDate);
    const date2 = new Date(newFinishingDate);
    const days = (date2 - date1) / (1000 * 60 * 60 * 24);
    updates.duration = days;
    if (startingDate) updates.startingDate = startingDate;
    if (finishingDate) updates.finishingDate = finishingDate;
  }

  const query = { _id: projectId };
  const options = { new: true, runValidators: true };

  const updatedProject = await Project.findOneAndUpdate(
    query,
    updates,
    options
  );

  if (!updatedProject)
    throw new NotFoundError(
      `You don't have a project with the id = ${projectId}`
    );

  res.status(200).json({
    msg: `Projct: ${updatedProject.projectName} updated`,
    data: updatedProject,
  });
};

const deleteProject = async (req, res) => {
  const projectId = req.params.id;

  const deletedProject = await Project.findOneAndDelete({ _id: projectId });

  if (!deletedProject)
    throw new NotFoundError(
      `You don't have a project with the id = ${projectId}`
    );

  res.status(200).json({ msg: 'Project Removed' });
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
};
