const db = require('../../database/db')

//Middlewares
const eventSanitizeInput = require('../middlewares/querySanitizerMiddleware')
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware')
const fs = require('fs')
const path = require('path')
const { uploadToLog } = require('../middlewares/activityLogger');
const axios = require('axios');
const { updateContentStat, deductContentStat } = require("../middlewares/contentStatUpdater");
const { limitWords } = require("../middlewares/limitWords");

/**
 * Retrieves all non-archived events from the database and sends the event information as a JSON response.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the events, the database query, or any other error occurs.
 * @returns {Object} Returns a JSON response with the retrieved events or an error status.
 */
const getAllEvents = async (req, res) => {
    console.log(`getAllEvents() from ${req.ip}`);
    try {
        const getAllEventsQuery = `
            SELECT event.* FROM event
            INNER JOIN member_profile ON member_profile.member_id = event.author_id
            WHERE member_profile.date_restrict IS NULL AND member_profile.archive = 0 AND event.archive = 0
        `;
        db.query(getAllEventsQuery, [], (getError, getResult) => {
            if (getError) {
                console.error(getError);
                return res.status(500).json(getError)
            }

            if (getResult.length > 0)
                return res.status(200).json(getResult);
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

/**
 * Retrieves an event by its unique identifier from the database.
 *
 * @function
 * @async
 * @param {string} eventId - The unique identifier of the event to retrieve.
 * @throws {Error} Throws an error if there is an issue with the database query or any other error occurs.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array containing the retrieved event or rejects with an error.
 */
const getEventById = async (eventId) => {
    return new Promise((resolve, reject) => {
        const getEventByIdQuery = `
            SELECT event.* FROM event
            INNER JOIN member_profile ON member_profile.member_id = event.author_id
            WHERE member_profile.date_restrict IS NULL AND member_profile.archive = 0 AND event_id = ?
        `;
        db.query(getEventByIdQuery, [eventSanitizeInput(eventId)], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}

/**
 * Retrieves an event by its unique identifier from the database and sends the event information as a JSON response.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with parameters.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.eventId - The unique identifier of the event to retrieve.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the event, the database query, or any other error occurs.
 * @returns {void} Sends the retrieved event information as a JSON response or an error status.
 */
const getEvent = async (req, res) => {
    console.log(`getEvent() from ${req.ip}`);
    const { eventId } = req.params;
    try {
        const result = await getEventById(eventId)
        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            console.log(`Event (${eventId}) does not exist`);
            return res.status(500).json({ error: 'Event does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * Retrieves all non-archived events authored by a specific user from the database and sends the event information as a JSON response.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with parameters.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.userId - The unique identifier of the author for whom to retrieve the events.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the events, the database query, or any other error occurs.
 * @returns {void} Sends the retrieved event information as a JSON response or an error status.
 */
const getEventsByAuthor = async (req, res) => {
    console.log(`getEventsByAuthor() from ${req.ip}`);
    const { userId } = req.params

    try {
        const getEventsByUserIdQuery = `
            SELECT event.*, member_profile.name FROM event
            INNER JOIN member_profile ON event.author_id = member_profile.member_id
            WHERE event.author_id = ? AND event.archive = 0
            AND member_profile.date_restrict IS NULL AND member_profile.archive = 0
            ORDER BY date DESC
        `;
        db.query(getEventsByUserIdQuery, [userId], (getError, getResult) => {
            if (getError) {
                console.log(getError);
                return res.status(500).json({ error: 'Failed to fetch events' });
            } else {
                return res.status(200).json(getResult);
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

// Function to move file to a specified directory
const moveFileToDirectory = (file, newId, destinationDirectory) => {
    try {
        const fixedExtension = path.extname(file.originalname).toLowerCase();
        const newFileName = newId + fixedExtension
        const filePath = path.join(__dirname, destinationDirectory, newFileName)

        // Write the file, overwriting if it already exists
        fs.writeFileSync(filePath, file.buffer)

        return newFileName
    } catch (error) {
        console.error('Error moving file:', error)
        throw error // You might want to handle or log the error appropriately
    }
}

/**
 * Reads and returns the binary data (image blob) from the specified file path.
 *
 * @function
 * @param {string} imagePath - The file path of the image.
 * @returns {Buffer} Returns a Buffer containing the binary data of the image.
 */
const getImageBlob = (imagePath) => {
    return fs.readFileSync(imagePath)
}

/**
 * Retrieves the image associated with a specific event from the database and sends it as the response.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with parameters.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.eventId - The unique identifier of the event for which to retrieve the image.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the image, the database query, or any other error occurs.
 * @returns {void} Sends the retrieved image binary data as the response or an error status.
 */
const getEventImage = async (req, res) => {
    const { eventId } = req.params;

    const getImageQuery = `SELECT image FROM event WHERE event_id = ?`;
    db.query(getImageQuery, [eventId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {
            const imgPath = path.join(__dirname, '../../public/img/event-pics', result[0].image);
            try {
                const imageBlob = getImageBlob(imgPath);

                // Set the appropriate content type for the image
                res.setHeader('Content-Type', 'image/jpeg');

                // Send the image binary data as the response
                res.status(200).send(imageBlob);
            } catch (error) {
                console.error('Error fetching image:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            return res.status(500).json(err);
        }
    });
}

/**
 * Creates a new event or updates an existing event in the database based on the provided data.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with body.
 * @param {Object} req.body - The request body containing information about the event to create or update.
 * @param {string} req.body.eventId - The unique identifier of the event to update (optional for creating a new event).
 * @param {string} req.body.eventAuthor - The unique identifier of the event author.
 * @param {string} req.body.eventDate - The date of the event.
 * @param {string} req.body.eventTime - The time of the event.
 * @param {string} req.body.eventLocation - The location/address of the event.
 * @param {string} req.body.eventTitle - The title of the event.
 * @param {string} req.body.eventDescription - The description/body of the event.
 * @param {string} req.body.username - The username of the user performing the action.
 * @param {string} req.body.eventImg - The base64-encoded image data of the event.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with creating or updating the event, the database query, or any other error occurs.
 * @returns {Object} Returns a JSON response indicating the success or failure of the event creation or update.
 */
const createUpdateEvent = async (req, res) => {
    console.log(`createUpdateEvent() from ${req.ip}`);
    const { eventId, eventAuthor, eventDate, eventTime, eventLocation, eventTitle, eventDescription, username, eventImg } = req.body;
    try {
        const retrieveEvent = await getEventById(eventId);
        const dateObject = new Date(eventDate);
        const formattedDate = dateObject.toISOString().split('T')[0];
        // const date = new Date(eventDate);

        // if an event already exist then update event
        if (retrieveEvent.length > 0 && retrieveEvent[0].hasOwnProperty('event_id')) {
            const OldimageId = path.basename(retrieveEvent[0].image, path.extname(retrieveEvent[0].image));
            let currentImg = retrieveEvent[0].image;
            // Delete the old image file
            const oldImagePath = path.join(__dirname, '../../public/img/event-pics/', retrieveEvent[0].image);

            const base64Image = eventImg.split(';base64,').pop();
            const imageName = OldimageId + '.' + getFileExtensionFromDataURL(eventImg);
            const eventPicPath = path.join(__dirname, '../../public/img/event-pics/', imageName);

            if (base64Image.length > 0) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Error deleting old image:', err);
                    } else {
                        // console.log('Old image deleted successfully');
                        // Continue with saving the new image
                        fs.writeFile(eventPicPath, base64Image, { encoding: 'base64' }, function(err) {
                            if (err) {
                                console.log('Error saving new profile image:', err);
                            }
                        });
                    }
                });
                currentImg = imageName;
            }

            const updateEventQuery = `
                UPDATE event SET
                title = ?,
                description = ?,
                image = ?,
                date_modified = NOW()
                WHERE event_id = ?
            `;
            const updateEventParameters = [eventTitle, eventDescription, currentImg, eventId];
            db.query(updateEventQuery, updateEventParameters, (updateError, updateRes) => {
                if (updateError) {
                    console.log(updateError)
                    return res.status(500).json({ error: 'Failed to update event' })
                }

                if (updateRes.affectedRows > 0) {
                    const logRes = uploadToLog(eventAuthor, eventId, username, 'updated an', 'event', eventTitle);

                    if (logRes) {
                        console.log(`Event (${eventId}) updated successfully`);
                        return res.status(200).json({ message: "Event updated successfully" });
                    }
                }
            });
        } else {
            const newId = uniqueId.uniqueIdGenerator()
            const insertEventQuery = `
                INSERT INTO event (
                    event_id,
                    author_id,
                    date_created,
                    address,
                    date,
                    time,
                    title,
                    description,
                    image
                )
                VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)
            `;
            const insertEventParameters = [newId, eventAuthor, eventLocation, formattedDate, eventTime, eventTitle, eventDescription, eventImg];
            db.query(insertEventQuery, insertEventParameters, (insertEventError, insertEventResult) => {
                if (insertEventError) {
                    console.error(insertEventError);
                    return res.status(500).json({ error: 'Failed to create event' });
                }

                if (insertEventResult.affectedRows > 0) {
                    const logRes = uploadToLog(eventAuthor, newId, username, 'posted an', 'event', eventTitle);
                    axios.post(`${process.env.EMAIL_DOMAIN}/newsletter`, {
                        username: username,
                        type: 'Event',
                        title: eventTitle,
                        img: `event-pics/${eventImg}`,
                        details: limitWords(eventDescription, 60),
                        contentId: newId
                    });

                    if (logRes) {
                        console.log(`Event (${newId}) created successfully`);
                        updateContentStat("event");
                        return res.status(200).json({ message: "Event created successfully" });
                    }
                }
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

/**
 * Archives (soft deletes) an event in the database based on the provided event ID.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with body.
 * @param {Object} req.body - The request body containing information about the event to delete.
 * @param {string} req.body.eventId - The unique identifier of the event to delete.
 * @param {string} req.body.username - The username of the user performing the action.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with archiving the event, the database query, or any other error occurs.
 * @returns {Object} Returns a JSON response indicating the success or failure of archiving the event.
 */
const deleteEvent = async (req, res) => {
    const { eventId, username } = req.body

    try {
        const result = await getEventById(eventId);
        if (result.length > 0 && result[0].hasOwnProperty('event_id') && result[0].archive == 0) {
            const archiveEventQuery = `
                UPDATE event
                SET archive = 1
                WHERE event_id = ?
            `;
            db.query(archiveEventQuery, [eventId], (eventArchiveError, eventArchiveResult) => {
                if (eventArchiveError) {
                    console.error(eventArchiveError);
                    console.log(`Event (${eventId}) delete failed`);
                    return res.status(500).json({ error: 'Failed to delete event' });
                }

                if (eventArchiveResult.affectedRows > 0) {
                    const logRes = uploadToLog(result[0].author_id, result[0].event_id, username, 'deleted an', 'event', result[0].title);
                    if (logRes) {
                        const eventDateCreated = result[0].date_created.toISOString().split("T")[0];
                        deductContentStat(eventDateCreated, "event");
                        console.log(`Event (${eventId}) deleted successfully`);
                        return res.status(200).json({ message: 'Event deleted successfully' });
                    }
                }
            });
        } else {
            return res.status(500).json({ error: 'Event does not exist!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getAllEvents,
    getEventsByAuthor,
    getEvent,
    getEventImage,
    createUpdateEvent,
    deleteEvent,
}
