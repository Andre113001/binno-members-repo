const db = require('../../database/db');

/**
* Create or Update a Content Stat based on the current date and the type of content
* @param {content_type} string - should be "blog", "guide", "post", or "event"
*/
const updateContentStat = async (content_type) => {
	return new Promise((resolve, reject) => {
		const currentDate = new Date();
		let currentYear = currentDate.getFullYear();
		let currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
		let currentDay = String(currentDate.getDate()).padStart(2, '0');
		let currentFormattedDate = `${currentYear}-${currentMonth}-${currentDay}`;

		const checkContentStatDateQuery = `
			 SELECT * FROM content_stat WHERE
			 date = ? AND content_type = ?
		`;
		db.query(checkContentStatDateQuery, [currentFormattedDate, content_type], (checkError, checkResult) => {
			if (checkError) reject(checkError);
			else if (checkResult.length > 0) {
				const updateContentStatQuery = `
					UPDATE content_stat SET
					count = count + 1
					WHERE date = ? AND content_type = ?
			  `;
				db.query(updateContentStatQuery, [currentFormattedDate, content_type], (updateError, updateResult) => {
					if (updateError) reject(updateError);
					else resolve(updateResult);
				});
			}
			else {
				const createContentStatQuery = `
					INSERT INTO content_stat (
						 content_type, date, count
					)
					VALUES (?, NOW(), 1)
			  `;
				db.query(createContentStatQuery, content_type, (createError, createResult) => {
					if (createError) reject(createError);
					else resolve(createResult);
				});
			}
		});
	});
}

module.exports = {
	updateContentStat
};
