const db = require("../../database/db");

/**
 * Retrieves the count of daily visits.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} A promise resolving to a JSON response containing the count of daily visits or an error message.
 */
async function countDailyVisit(req, res) {
	console.log(`GET /api/visit/count/daily`);

	try {
		const currentDate = getCurrentDate();
		const dailyVisitCount = await new Promise((resolve, reject) => {
			const query = `
				SELECT SUM(member_count) AS daily_visit_count
				FROM member_stat
				WHERE stat_date = ? AND member_type = "Visitor"
			`;

			db.query(query, currentDate, (error, result) => {
				if (error) reject(error);
				else resolve(result[0].daily_visit_count);
			});
		});

		return res.status(200).json(parseInt(dailyVisitCount) || 0);
	} catch (error) {
		console.error("500 Internal Server Error");
		console.error(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error
		});
	}
}

/**
 * Retrieves the count of all visits.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} A promise resolving to a JSON response containing the count of all visits or an error message.
 */
async function countAllVisit(req, res) {
	console.log(`GET /api/visit/count/all`)

	try {
		const allVisitCount = await new Promise((resolve, reject) => {
			const query = `
				SELECT SUM(member_count) AS visit_count
				FROM member_stat
				WHERE member_type = "Visitor"
			`;

			db.query(query, (error, result) => {
				if (error) reject(error);
				else resolve(result[0].visit_count);
			});
		});

		return res.status(200).json(parseInt(allVisitCount) || 0);
	} catch (error) {
		console.error("500 Internal Server Error");
		console.error(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error
		});
	}
}

/**
 * Increments the visitor count for the current date in the database.
 * If there is no existing record for the current date, it creates one with a count of 1.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} A Promise that resolves to an object containing a message indicating the success of the operation.
 */
async function addVisitCount(req, res) {
	console.log("POST /api/visit/count/add");

	try {
		const currentDate = getCurrentDate();

		const checkDailyVisitCount = await new Promise((resolve, reject) => {
			const checkDailyVisitCountQuery = `
				SELECT * FROM member_stat
				WHERE stat_date = ? AND member_type = "Visitor"
			`;

			db.query(checkDailyVisitCountQuery, currentDate, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

		await new Promise((resolve, reject) => {
			var updateVisitCountQuery = `
				UPDATE member_stat SET
				member_count = member_count + 1
				WHERE stat_date = ? and member_type = "Visitor"
			`;

			if (checkDailyVisitCount.length == 0) {
				updateVisitCountQuery = `
					INSERT INTO member_stat (
						stat_date,
						member_type,
						member_count
					)
					VALUES (?, "Visitor", 1)
				`
			}
			db.query(updateVisitCountQuery, currentDate, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

		return res.status(200).json({
			message: "Visitor count incremented successfully"
		});
	} catch (error) {
		console.error("500 Internal Server Error");
		console.error(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error
		});
	}
}

/**
 * Retrieves the current date in the format YYYY-MM-DD.
 *
 * @returns {string} The current date in the format YYYY-MM-DD.
 */
function getCurrentDate() {
	console.log("getCurrentDate()");

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
	const currentDay = String(currentDate.getDate()).padStart(2, '0');
	const currentFormattedDate = `${currentYear}-${currentMonth}-${currentDay}`;

	return currentFormattedDate;
}

module.exports = {
	countDailyVisit,
	countAllVisit,
	addVisitCount
}
