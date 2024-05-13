/**
	DB tables setup

	create table mentorship_request (
		request_id varchar(40) NOT NULL,
		mentor_id varchar(40) NOT NULL,
		enabler_id varchar(40) NOT NULL,
		sender_id varchar(40) NOT NULL,
		status varchar(40) DEFAULT "Pending",
		message text,
		docs_path text,
		date_responded datetime,
		date_created datetime,
		archive tinyint DEFAULT 0,
		primary key(request_id),
		foreign key(mentor_id) references member_i(member_id),
		foreign key(enabler_id) references member_i(member_id),
		foreign key(sender_id) references member_i(member_id)
	);

	create table mentor_enabler (
		mentor_id varchar(40) NOT NULL,
		enabler_id varchar(40) NOT NULL,
		request_id varchar(40) NOT NULL,
		date_created datetime NOT NULL,
		mentor_end_partnership tinyint DEFAULT 0,
		enabler_end_partnership tinyint DEFAULT 0,
		archive tinyint DEFAULT 0,
		primary key(mentor_id, enabler_id),
		foreign key(mentor_id) references member_i(member_id),
		foreign key(enabler_id) references member_i(member_id),
		foreign key(request_id) references mentorship_request(request_id)
	);
*/

const db = require("../../database/db");
const fs = require("fs");
const path = require("path");
const { getMemberById } = require("../controllers/memberController.js");
const { uniqueIdGenerator } = require("../middlewares/uniqueIdGeneratorMiddleware")

/**
 * Retrieves a list of all mentors.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with the list of mentors or an error message.
 */
async function listAllMentors(req, res) {
	console.log("GET /api/mentor/list/all");

	try {
		const mentorsList = await new Promise((resolve, reject) => {
			const listMentorsQuery = `
				SELECT
					mi.member_id,
					ms.setting_institution AS name,
					ms.setting_tagline AS tagline,
					ms.setting_bio AS biography,
					ms.setting_profilepic AS profile_pic,
					ms.setting_coverpic AS cover_pic
				FROM member_i AS mi
				INNER JOIN member_settings AS ms ON ms.setting_memberId = mi.member_id
				WHERE mi.member_type = 4 AND mi.member_flag = 1 AND mi.member_restrict IS NULL
				ORDER BY name
			`;
			db.query(listMentorsQuery, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

		return res.status(200).json(mentorsList);
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
 * Lists available mentors who are not associated with any enabler.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with a response object containing the list of available mentors or an error message.
 */
async function listAvailableMentors(req, res) {
	console.log("GET /api/mentor/list");

	try {
		const availableMentors = await new Promise((resolve, reject) => {
			const listAvailableMentorsQuery = `
				SELECT
					mi.member_id,
					ms.setting_profilepic AS profile_pic,
					ms.setting_institution AS name
				FROM member_i AS mi
				LEFT JOIN mentor_enabler AS me ON mi.member_id = me.mentor_id
				INNER JOIN member_settings AS ms ON ms.setting_memberId = mi.member_id
				WHERE mi.member_type = 4 AND mi.member_flag = 1 AND mi.member_restrict IS NULL
					AND me.mentor_id IS NULL
				ORDER BY ms.setting_institution
			`;

			db.query(listAvailableMentorsQuery, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

		return res.status(200).json(availableMentors);
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
 * Creates a mentorship request.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing mentorId, enablerId, and senderId.
 * @param {string} req.body.mentorId - The ID of the mentor.
 * @param {string} req.body.enablerId - The ID of the enabler.
 * @param {string} req.body.senderId - The ID of the sender.
 * @param {string} req.body.message - The request message.
 * @param {Object} req.file - The file attached.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with a response object indicating the success or failure of the request creation.
 */
async function createMentorshipRequest(req, res) {
	console.log("POST /api/mentor/request/create");
	const { mentorId, enablerId, senderId, message } = req.body;

	try {
		const verifyMentor = await verifyMemberType(mentorId, 4);
		if (verifyMentor.length == 0) {
			console.log(`404 Mentor (${mentorId}) not found`);
			return res.status(404).json({
				message: "Mentor not found"
			});
		}

		const verifyEnabler = await verifyMemberType(enablerId, 2);
		if (verifyEnabler.length == 0) {
			console.log(`404 Enabler (${enablerId}) not found`);
			return res.status(404).json({
				message: "Enabler not found"
			});
		}

		const verifySender = await getMemberById(senderId);
		if (verifySender.length == 0) {
			console.log(`404 Sender (${senderId}) not found`);
			return res.status(404).json({
				message: "Sender not found"
			});
		}

		// the sender should be either an enabler or a mentor
		if (senderId != enablerId && senderId != mentorId) {
			console.log(`400 senderId (${senderId}) should be equal to enablerId or mentorId`);
			return res.status(400).json({
				message: "senderId should be equal to enablerId or mentorId"
			});
		}

		const requestExist = await getMentorshipRequest(mentorId, enablerId);
		if (requestExist.length > 0) {
			const request = requestExist[0];
			console.log(`403 Mentorship request already exist from ${request.sender_id} ${request.sender_name}`);
			return res.status(403).json({
				message: `Mentorship request already exist from ${request.sender_name}`
			});
		}

		const mentorAvailable = await new Promise((resolve, reject) => {
			const checkMentorAvailabilityQuery = `
				SELECT * FROM mentor_enabler
				WHERE mentor_id = ?
			`;

			db.query(checkMentorAvailabilityQuery, mentorId, (checkError, checkResult) => {
				if (checkError) reject(checkError);
				else resolve(checkResult);
			});
		});
		if (mentorAvailable.length > 0) {
			console.log(`403 Mentor not available`);
			return res.status(403).json({
				message: "Mentor not available"
			});
		}

		const requestId = uniqueIdGenerator();
		var destinationFolder = null;

		if (req.file) {
			destinationFolder = `./private/docs/mentorship_request/${requestId}`;
			const filePath = path.join(destinationFolder, req.file.originalname);

			if (!fs.existsSync(destinationFolder)) {
				fs.mkdirSync(destinationFolder, { recursive: true });
				fs.writeFileSync(filePath, req.file.buffer);
			}
		}

		await new Promise((resolve, reject) => {
			const createRequestQuery = `
				INSERT INTO mentorship_request (
					request_id,
					mentor_id,
					enabler_id,
					sender_id,
					message,
					docs_path,
					date_created
				)
				VALUES (?, ?, ?, ?, ?, ?, NOW())
			`;
			const parameters = [requestId, mentorId, enablerId, senderId, message, destinationFolder];

			db.query(createRequestQuery, parameters, (createError, createResult) => {
				if (createError) reject(createError);
				else resolve(createResult);
			});
		});

		return res.status(200).json({
			message: "Mentorship request created successfully"
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
 * Accepts a mentorship request, updates its status to "Accepted", delete mentor instances in the mentorship request list, and creates a mentor-enabler relationship.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing requestId, mentorId, and enablerId.
 * @param {string} req.body.requestId - The ID of the mentorship request.
 * @param {string} req.body.mentorId - The ID of the mentor.
 * @param {string} req.body.enablerId - The ID of the enabler.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with a response object indicating the success or failure of the request acceptance.
 */
async function acceptMentorshipRequest(req, res) {
	console.log(`POST /api/mentor/request/accept`);
	const { requestId, mentorId, enablerId } = req.body;

	try {
		const requestDetails = await getMentorshipRequest(mentorId, enablerId);

		if (requestDetails.length == 0 || requestId != requestDetails[0]["request_id"]) {
			console.log(`404 Mentorship request (${requestId}) not found`);
			return res.status(404).json({
				message: "Mentorship request not found"
			});
		}

		await updateRequestStatus(requestId, "Accepted");
		// NOTE: it was agreed that a mentor can only have one enabler
		await deleteMentorInstancesInMentorshipRequests(mentorId, requestId);
		await createMentorEnablerRelationship(requestId, mentorId, enablerId);

		console.log(`200 Mentorship Request (${requestId}) accepted`);
		return res.status(200).json({
			message: "Mentorship Request accepted"
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
 * Rejects a mentorship request.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing mentorId, and enablerId.
 * @param {string} req.body.mentorId - The ID of the mentor.
 * @param {string} req.body.enablerId - The ID of the enabler.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with a response object indicating the success or failure of rejecting the mentorship request.
 */
async function rejectMentorshipRequest(req, res) {
	console.log(`POST /api/mentor/request/decline from ${req.ip}`);
	const { mentorId, enablerId } = req.body;

	try {
		const requestDetails = await getMentorshipRequest(mentorId, enablerId);

		if (requestDetails.length == 0) {
			console.log(`404 Mentorship Request between (${mentorId}, ${enablerId}) not found`);
			return res.status(404).json({
				message: "Mentorship request not found"
			});
		} else if (requestDetails[0]["status"] === "Accepted") {
			console.log(`403 Mentorship Request between (${mentorId}, ${enablerId}) was already accepted`);
			return res.status(403).json({
				message: "Mentorship request was already accepted"
			});
		}

		await deleteMentorshipRequest(requestDetails[0]["request_id"]);

		return res.status(200).json({
			message: "Mentorship request declined"
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
 * Cancels a mentorship request.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing requestId, enablerId, and mentorId.
 * @param {string} req.body.requestId - The ID of the mentorship request.
 * @param {string} req.body.enablerId - The ID of the enabler.
 * @param {string} req.body.mentorId - The ID of the mentor.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with a response object indicating the success or failure of the cancellation.
 */
async function cancelMentorshipRequest(req, res) {
	console.log("POST /api/mentor/request/cancel");
	const { requestId, enablerId, mentorId } = req.body;

	try {
		const verifyEnabler = await verifyMemberType(enablerId, 2);
		if (verifyEnabler.length == 0) {
			console.log(`404 Enabler (${enablerId}) not found`);
			return res.status(404).json({
				message: "Enabler not found"
			});
		}

		const verifyMentor = await verifyMemberType(mentorId, 4);
		if (verifyMentor.length == 0) {
			console.log(`404 Mentor (${mentorId}) not found`);
			return res.status(404).json({
				message: "Mentor not found"
			});
		}

		const mentorshipRequest = await getMentorshipRequest(mentorId, enablerId);
		if (mentorshipRequest.length == 0 || requestId !== mentorshipRequest[0].request_id) {
			console.log(`404 Mentorship request (${mentorId}, ${enablerId}) not found`);
			return res.status(404).json({
				message: "Mentorship request not found"
			});
		}

		await deleteMentorshipRequest(requestId);

		return res.status(200).json({
			message: "Mentorship request cancelled successfully"
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
 * Ends a mentor-enabler partnership.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing enablerId, mentorId, and requestor.
 * @param {string} req.body.enablerId - The ID of the enabler.
 * @param {string} req.body.mentorId - The ID of the mentor.
 * @param {string} req.body.requestor - The role of the party requesting to end the partnership (either "enabler" or "mentor").
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with a response object indicating the success or failure of ending the partnership.
 */
async function endPartnership(req, res) {
	console.log(`POST /api/mentor/partnership/end`);
	const { enablerId, mentorId, requestor } = req.body;

	try {
		if (requestor != "enabler" && requestor != "mentor") {
			console.log(`400 Wrong value ${requestor} for requestor, should be enabler or mentor`);
			return res.status(400).json({
				message: "Wrong value for requestor, should be enabler or mentor"
			});
		}

		const partnership = await getMentorEnablerPartnership(mentorId, enablerId);
		if (partnership.length == 0) {
			console.log(`404 Partnership not found`);
			return res.status(404).json({
				message: "Partnership not found"
			});
		}

		await new Promise((resolve, reject) => {
			let endPartnershipQuery = `
				UPDATE mentor_enabler SET
				mentor_end_partnership = 1
				WHERE mentor_id = ? AND enabler_id = ?
			`;

			if (requestor == "enabler") {
				endPartnershipQuery = `
					UPDATE mentor_enabler SET
					enabler_end_partnership = 1
					WHERE mentor_id = ? AND enabler_id = ?
				`;
			}

			db.query(endPartnershipQuery, [mentorId, enablerId], (endError, endResult) => {
				if (endError) reject(endError);
				else resolve(endResult);
			});
		});

		const updatedPartnership = await getMentorEnablerPartnership(mentorId, enablerId);
		const bothPartyAgreed = (
			updatedPartnership[0]["mentor_end_partnership"] == 1 &&
			updatedPartnership[0]["enabler_end_partnership"] == 1
		);

		if (bothPartyAgreed) {
			await deleteMentorEnablerPartnership(mentorId, enablerId);
			await deleteMentorshipRequest(updatedPartnership[0]["request_id"]);
			return res.status(200).json({
				message: "Partnership for both party ended successfully"
			});
		}

		return res.status(200).json({
			message: "End partnership request created successfully"
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
 * Cancels a request to end a mentor-enabler partnership.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing enablerId, mentorId, and requestor.
 * @param {string} req.body.enablerId - The ID of the enabler.
 * @param {string} req.body.mentorId - The ID of the mentor.
 * @param {string} req.body.requestor - The role of the party requesting to cancel the end partnership request (either "enabler" or "mentor").
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with a response object indicating the success or failure of cancelling the end partnership request.
 */
async function cancelEndPartnership(req, res) {
	console.log("POST /api/mentor/partnership/end/cancel")
	const { enablerId, mentorId, requestor } = req.body;

	try {
		if (requestor != "enabler" && requestor != "mentor") {
			console.log(`400 Wrong value ${requestor} for requestor, should be enabler or mentor`);
			return res.status(400).json({
				message: "Wrong value for requestor, should be enabler or mentor"
			});
		}

		const partnership = await getMentorEnablerPartnership(mentorId, enablerId);
		if (partnership.length == 0) {
			console.log(`404 Partnership not found`);
			return res.status(404).json({
				message: "Partnership not found"
			});
		}

		await new Promise((resolve, reject) => {
			let cancelQuery = `
				UPDATE mentor_enabler SET
				mentor_end_partnership = 0
				WHERE mentor_id = ? AND enabler_id = ?
			`;

			if (requestor == "enabler") {
				cancelQuery = `
					UPDATE mentor_enabler SET
					enabler_end_partnership = 0
					WHERE mentor_id = ? AND enabler_id = ?
				`;
			}

			db.query(cancelQuery, [mentorId, enablerId], (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

		return res.status(200).json({
			message: "End partnership request cancelled successfully"
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
 * Lists mentors associated with a specific enabler.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters object containing enablerId.
 * @param {string} req.params.enablerId - The ID of the enabler.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with a response object containing the list of mentors associated with the enabler or an error message.
 */
async function listMentorsByEnabler(req, res) {
	const { enablerId } = req.params;
	console.log(`GET /api/mentor/list/enabler/${enablerId}`);

	try {
		const verifyEnabler = await getMemberById(enablerId);
		if (verifyEnabler.length == 0 || verifyEnabler[0]["member_type"] != 2) {
			console.log(`404 Enabler (${enablerId}) not found`);
			return res.status(404).json({
				message: "Enabler not found"
			});
		}

		const mentorList = await new Promise((resolve, reject) => {
			const listEnablerMentorsQuery = `
				SELECT
					me.*,
					ms.setting_institution as mentor_name,
					ms.setting_profilepic as mentor_profile_pic
				FROM mentor_enabler AS me
				INNER JOIN
					member_i AS mi ON mi.member_id = me.mentor_id
				INNER JOIN
					member_settings AS ms ON ms.setting_memberId = mi.member_id
				WHERE me.enabler_id = ?
				ORDER BY mentor_name
			`;
			db.query(listEnablerMentorsQuery, enablerId, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

		return res.status(200).json(mentorList);
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
 * Lists mentorship requests sent by a specific sender.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters object containing senderId.
 * @param {string} req.params.senderId - The ID of the sender.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with a response object containing the list of mentorship requests sent by the sender or an error message.
 */
async function listMentorshipRequestBySender(req, res) {
	const { senderId } = req.params;
	console.log(`GET /api/mentor/request/list/sender/${senderId}`);

	try {
		const senderProfile = await getMemberById(senderId);
		if (senderProfile.length == 0) {
			console.log(`404 Sender (${senderId}) not found`);
			return res.status(404).json({
				message: "Sender not found"
			});
		}

		const senderRequestList = await new Promise((resolve, reject) => {
			const listRequestQuery = `
				SELECT
					mr.request_id,
					mr.mentor_id,
					mr.enabler_id,
					mr.sender_id,
					mr.message,
					mr.docs_path,
					mr.date_created,
					CASE
						WHEN mr.sender_id = mr.mentor_id THEN enabler_profile.setting_institution
						WHEN mr.sender_id = mr.enabler_id THEN mentor_profile.setting_institution
					END AS receiver_name,
					CASE
						WHEN mr.sender_id = mr.mentor_id THEN enabler_profile.setting_profilepic
						WHEN mr.sender_id = mr.enabler_id THEN mentor_profile.setting_profilepic
					END AS receiver_profile_pic
				FROM mentorship_request mr
				INNER JOIN
					member_settings AS mentor_profile ON mr.mentor_id = mentor_profile.setting_memberId
				INNER JOIN
					member_settings AS enabler_profile ON mr.enabler_id = enabler_profile.setting_memberId
				WHERE mr.sender_id = ?
					AND mr.status = "Pending"
				ORDER BY mr.date_created DESC
			`;

			db.query(listRequestQuery, senderId, (listError, listResult) => {
				if (listError) reject(listError);
				else resolve(listResult);
			});
		});

		return res.status(200).json(senderRequestList);
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
 * Lists mentorship requests received by a specific receiver (mentor or enabler).
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters object containing receiverId.
 * @param {string} req.params.receiverId - The ID of the receiver.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with a response object containing the list of mentorship requests received by the receiver or an error message.
 */
async function listMentorshipRequestByReceiver(req, res) {
	const { receiverId } = req.params;
	console.log(`GET /api/mentor/request/list/receiver/${receiverId}`);

	try {
		const receiverProfile = await getMemberById(receiverId);
		if (receiverProfile.length == 0) {
			console.log(`404 Receiver (${receiverId}) not found`);
			return res.status(404).json({
				message: "Receiver not found"
			});
		}

		const receiverRequestList = await new Promise((resolve, reject) => {
			const listRequestQuery = `
				SELECT
					mr.request_id,
					mr.mentor_id,
					mr.enabler_id,
					mr.sender_id,
					mr.message,
					mr.docs_path,
					mr.date_created,
					sender_profile.setting_institution AS sender_name,
					sender_profile.setting_profilepic AS sender_profile_pic
				FROM
					mentorship_request mr
				LEFT JOIN
					member_settings AS sender_profile ON mr.sender_id = sender_profile.setting_memberId
				WHERE
					(mr.mentor_id = ? OR mr.enabler_id = ?)
					AND mr.sender_id != ?
					AND mr.status = "Pending"
				ORDER BY mr.date_created DESC
			`;
			db.query(listRequestQuery, [receiverId, receiverId, receiverId], (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

		return res.status(200).json(receiverRequestList);
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
 * Retrieves the attached file associated with a mentorship request.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters object containing the requestId.
 * @param {string} req.params.requestId - The ID of the mentorship request.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with the attached file or an error message.
 */
async function getRequestAttachedFile(req, res) {
	const { requestId } = req.params;
	console.log(`GET /api/mentor/request/${requestId}/file`);

	try {
		const mentorshipRequest = await new Promise((resolve, reject) => {
			const verifyQuery = `
				SELECT * FROM mentorship_request
				WHERE request_id = ?
				AND status = "Pending"
			`;
			db.query(verifyQuery, requestId, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

		if (mentorshipRequest.length == 0) {
			console.log(`404 Mentorship request (${requestId}) not found`);
			return res.status(404).json({ message: "Mentorship request not found" });
		}

		if (!mentorshipRequest[0].docs_path) {
			console.log(`404 File not found`);
			return res.status(404).json({ message: "File not found" });
		}

		// NOTE: this logic is only good for one file, it should be refactored if multiple
		// files are agreed upon
		const filePath = path.join(__dirname, `../../private/docs/mentorship_request/${requestId}`);
		if (!fs.existsSync(filePath)) {
			console.log(`404 File not found`);
			return res.status(404).json({ message: "File not found" });
		}

		return res.status(200).sendFile(filePath);
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
 * Verifies the type of a member.
 *
 * @param {string} memberId - The ID of the member.
 * @param {number} memberType - The type of the member.
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of member profile objects matching the specified ID and type.
 */
function verifyMemberType(memberId, memberType) {
	console.log(`verifyMemberType(${memberId}, ${memberType})`);
	return new Promise((resolve, reject) => {
		const verifyMemberTypeQuery = `
			SELECT member_id, member_type FROM member_i
			WHERE member_id = ?
			AND member_type = ?
			AND member_flag = 1
		`;

		db.query(verifyMemberTypeQuery, [memberId, memberType], (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});
}

/**
 * Retrieves a mentorship request with the specified details.
 *
 * @param {string} mentorId - The ID of the mentor associated with the request.
 * @param {string} enablerId - The ID of the enabler associated with the request.
 * @returns {Promise} A promise that resolves with the mentorship request data if found, otherwise rejects with an error.
 */
function getMentorshipRequest(mentorId, enablerId) {
	console.log(`getMentorshipRequest(${mentorId}, ${enablerId})`);
	return new Promise((resolve, reject) => {
		const getMentorshipRequestQuery = `
			SELECT
				mr.*,
				ms.setting_institution as sender_name
			FROM mentorship_request AS mr
			INNER JOIN member_i AS mi ON mr.sender_id = mi.member_id
			INNER JOIN member_settings AS ms ON mi.member_id = ms.setting_memberId
			WHERE mentor_id = ?
			AND enabler_id = ?
		`;
		const parameters = [mentorId, enablerId];

		db.query(getMentorshipRequestQuery, parameters, (getError, getResult) => {
			if (getError) reject(getError);
			else resolve(getResult);
		});
	});
}

/**
 * Updates the status of a mentorship request.
 *
 * @param {string} requestId - The ID of the mentorship request to update.
 * @param {string} requestStatus - The new status of the mentorship request. Should be "Accepted" or "Declined".
 * @returns {Promise} A promise that resolves if the update is successful, otherwise rejects with an error.
 */
function updateRequestStatus(requestId, requestStatus) {
	console.log(`updateRequestStatus(${requestId}, ${requestStatus})`);

	return new Promise((resolve, reject) => {
		const statusMap = {
			"Accepted": true,
			"Declined": true
		}

		if (!statusMap[requestStatus]) {
			reject(`Error: Wrong request status (${requestStatus}), should be Accepted or Declined`);
			return;
		}

		let updateStatusQuery = "";
		let updateQueryParams = [];

		if (requestStatus === "Accepted") {
			updateStatusQuery = `
				UPDATE mentorship_request SET
				status = ?,
				date_responded = NOW()
				WHERE request_id = ?
			`;
			updateQueryParams = [requestStatus, requestId];
		}

		// hard delete if declined
		if (requestStatus === "Declined") {
			updateStatusQuery = `
				DELETE FROM mentorship_request
				WHERE request_id = ?
			`;
			updateQueryParams = [requestId];
		}

		db.query(updateStatusQuery, updateQueryParams, (updateError, updateResult) => {
			if (updateError) reject(updateError);
			else resolve(updateResult);
		});
	});
}

/**
 * Deletes mentor instances in mentorship requests except for a specific request.
 *
 * @param {string} mentorId - The ID of the mentor.
 * @param {string} requestId - The ID of the specific mentorship request to exclude.
 * @returns {Promise<any>} - A promise that resolves once the mentor instances are deleted.
 */
function deleteMentorInstancesInMentorshipRequests(mentorId, requestId) {
	console.log(`deleteMentorInstancesInMentorshipRequests(${mentorId}, ${requestId})`);
	return new Promise((resolve, reject) => {
		const deleteRequest = `
			DELETE FROM mentorship_request
			WHERE mentor_id = ? AND request_id != ?
		`;

		db.query(deleteRequest, [mentorId, requestId], (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});
}

/**
 * Creates a mentor-trainee relationship in the database.
 *
 * @param {string} requestId - The ID of the request associated with the relationship.
 * @param {string} mentorId - The ID of the mentor.
 * @param {string} enablerId - The ID of the enabler.
 * @returns {Promise<any>} - A promise that resolves with the result of the relationship creation.
 */
function createMentorEnablerRelationship(requestId, mentorId, enablerId) {
	console.log(`createMentorEnablerRelationship(${requestId}, ${mentorId}, ${enablerId})`);
	return new Promise((resolve, reject) => {
		const createRelationshipQuery = `
			INSERT INTO mentor_enabler (
				mentor_id,
				enabler_id,
				request_id,
				date_created
			)
			VALUES (?, ?, ?, NOW())
		`;
		const parameters = [mentorId, enablerId, requestId];
		db.query(createRelationshipQuery, parameters, (createError, createResult) => {
			if (createError) reject(createError);
			else resolve(createResult);
		});
	});
}

/**
 * Deletes a mentorship request.
 *
 * @param {string} requestId - The ID of the mentorship request to be deleted.
 * @returns {Promise<any>} - A promise that resolves once the request is deleted.
 */
function deleteMentorshipRequest(requestId) {
	console.log(`deleteMentorshipRequest(${requestId})`);
	return new Promise((resolve, reject) => {
		const deleteRequest = `
			DELETE FROM mentorship_request
			WHERE request_id = ?
		`;

		db.query(deleteRequest, requestId, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});
}

/**
 * Retrieves a mentor-enabler partnership.
 *
 * @param {string} mentorId - The ID of the mentor.
 * @param {string} enablerId - The ID of the enabler.
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of mentor-enabler partnership objects matching the specified IDs.
 */
function getMentorEnablerPartnership(mentorId, enablerId) {
	console.log(`getMentorEnablerPartnership(${mentorId}, ${enablerId})`);
	return new Promise((resolve, reject) => {
		const getPartnershipQuery = `
			SELECT * FROM mentor_enabler
			WHERE mentor_id = ? AND enabler_id = ?
		`;
		db.query(getPartnershipQuery, [mentorId, enablerId], (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});
}

/**
 * Deletes a mentor-enabler partnership.
 *
 * @param {string} mentorId - The ID of the mentor.
 * @param {string} enablerId - The ID of the enabler.
 * @returns {Promise<any>} - A promise that resolves once the partnership is deleted.
 */
function deleteMentorEnablerPartnership(mentorId, enablerId) {
	console.log(`deleteMentorEnablerPartnership(${mentorId}, ${enablerId})`);
	return new Promise((resolve, reject) => {
		const deletePartnership = `
			DELETE FROM mentor_enabler
			WHERE mentor_id = ? AND enabler_id = ?
		`;
		db.query(deletePartnership, [mentorId, enablerId], (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});
}

module.exports = {
	listAllMentors,
	listAvailableMentors,
	createMentorshipRequest,
	acceptMentorshipRequest,
	rejectMentorshipRequest,
	cancelMentorshipRequest,
	endPartnership,
	cancelEndPartnership,
	listMentorsByEnabler,
	listMentorshipRequestBySender,
	listMentorshipRequestByReceiver,
	getRequestAttachedFile
}
