const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const logEvents = async (msg, file) => {
  const currentTime = format(new Date(), 'yyyy/MM/dd\tHH:mm:ss');
  const logItem = `${currentTime}\t${uuid()}\t${msg}\n`;
  const logFolderPath = path.join(__dirname, '..', 'log');
  const logFilePath = path.join(logFolderPath, file);

  try {
    if (!fs.existsSync(logFolderPath)) {
      await fs.mkdir(logFolderPath, (err) => {
        if (err) throw err;
      });
    }

    await fsPromises.appendFile(logFilePath, logItem);
  } catch (err) {
    console.log(err);
  }
};

module.exports = logEvents;
