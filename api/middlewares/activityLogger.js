const db = require('../../database/db');
const uniqueId = require('./uniqueIdGeneratorMiddleware'); // Adjust the path accordingly

const uploadToLog = async (authorId, contentId, username, action, type, title) => {
  console.log(`uploadToLog(${contentId}, ${username}, ${action}, ${type}, ${title})`);
  return new Promise((resolve, reject) => {
    const newHistoryId = uniqueId.uniqueIdGenerator();

    // const createHistoryLogQuery = `
    //   INSERT INTO history_i (
    //     history_id,
    //     history_datecreated,
    //     history_author,
    //     history_reference,
    //     history_text
    //   )
    //   VALUES (?, NOW(), ?, ?, ?)
    // `;
    // NOTE: new query for the new database - AL
    const createActivityLogQuery = `
      INSERT INTO activity_log (
        log_id,
        content_id,
        log_text,
        date_created
      )
      VALUES (?, ?, ?, NOW())
    `;

    // const queryParameters = [newHistoryId, authorId, contentId, `${username} ${action} ${type}: '${title}'`]
    const queryParameters = [newHistoryId, contentId, `${username} ${action} ${type}: '${title}'`];

    db.query(createActivityLogQuery, queryParameters, (err, result) => {
      if (err) {
        console.error(err);
        reject(false);
      } else if (result.affectedRows > 0) {
        //   console.log(`History uploaded to id ${newHistoryId}`);
        resolve(true);
      } else {
        console.error('Failed to insert into the database.');
        resolve(false);
      }
    });
  });
};

module.exports = {
  uploadToLog
};
