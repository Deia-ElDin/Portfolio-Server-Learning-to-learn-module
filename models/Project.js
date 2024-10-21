const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Must provide the project name'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Must provide the project rating'],
  },
  commercial: {
    type: Boolean,
    default: false,
  },
  responsive: {
    type: Boolean,
    default: false,
  },
  projectImg: {
    data: Buffer,
    contentType: String,
  },
  technologies: {
    type: String,
    required: [true, 'Must provide the project technologies'],
  },
  sumCodeLines: Number,
  ui: {
    type: Boolean,
    default: false,
  },
  uiLiveDemoLink: {
    type: String,
    default: '',
  },
  uiDownloadLink: {
    type: String,
    default: '',
  },
  uiPackageJson: String,
  server: {
    type: Boolean,
    default: false,
  },
  serverLiveDemoLink: {
    type: String,
    default: '',
  },
  serverDownloadLink: {
    type: String,
    default: '',
  },
  serverPackageJson: String,
  testedWith: String,
  startingDate: {
    type: String,
    required: [true, 'Must provide the starting date'],
    trim: true,
  },
  finishingDate: {
    type: String,
    required: [true, 'Must provide the finishing date'],
    trim: true,
  },
  duration: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

ProjectSchema.pre('save', function () {
  let sum = 0;
  const technologiesObj = JSON.parse(this.technologies);
  Object.values(technologiesObj).map((value) => (sum += value));
  this.sumCodeLines = sum;

  if (this.uiLiveDemoLink || this.uiDownloadLink || this.uiPackageJson) {
    this.ui = true;
  }

  if (
    this.serverLiveDemoLink ||
    this.serverDownloadLink ||
    this.serverPackageJson
  ) {
    this.server = true;
  }

  const date1 = new Date(this.startingDate);
  const date2 = new Date(this.finishingDate);
  const days = (date2 - date1) / (1000 * 60 * 60 * 24);
  this.duration = days;
});

module.exports = mongoose.model('Project', ProjectSchema);
