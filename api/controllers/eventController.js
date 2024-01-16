const db = require('../../database/db')

//Middlewares
const eventSanitizeInput = require('../middlewares/querySanitizerMiddleware')
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware')
const fs = require('fs')
const path = require('path')

const event = async (req, res) => {
    try {
        db.query("SELECT * FROM event_i", [], (err, result) => {
            if (err) {
                return res.status(500).json(err)
            }
    
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(500).json(err)
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

// Event Finder by ID
const getEventById = async (eventId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM event_i WHERE event_id = ? ',
            [eventSanitizeInput(eventId)],
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )
    })
}

// Event Reader
const fetchEventById = async (req, res) => {
    const { eventId } = req.params
    try {
        const result = await getEventById(eventId)
        if (result.length > 0) {
            return res.json(result)
        } else {
            return res.status(500).json({ error: 'Cannot fetch Event ID' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const events_user = async (req, res) => {
    const { userId } = req.params

    try {
        db.query(
            'SELECT * FROM event_i WHERE event_author = ?',
            [userId],
            (eventError, eventRes) => {
                if (eventError) {
                    console.log(eventError)
                    return res
                        .status(500)
                        .json({ error: 'Failed to fetch events', eventError })
                } else {
                    return res.status(200).json(eventRes)
                }
            }
        )
    } catch (error) {
        res.status(500).json(Error, error)
    }
}

// Function to move file to a specified directory
const moveFileToDirectory = (file, newId, destinationDirectory) => {
    try {
        const fixedExtension = '.png' // Use the desired extension
        const newFileName = newId + fixedExtension
        const filePath = path.join(__dirname, destinationDirectory, newFileName)

        // Write the file, overwriting if it already exists
        fs.writeFileSync(filePath, file.buffer)

        return filePath
    } catch (error) {
        console.error('Error moving file:', error)
        throw error // You might want to handle or log the error appropriately
    }
}

const getImageBlob = (imagePath) => {
    return fs.readFileSync(imagePath)
}

const getEventImage = async (req, res) => {
    const { eventId } = req.params

    db.query(
        'SELECT event_img FROM event_i WHERE event_id = ?',
        [eventId],
        (err, result) => {
            if (err) {
                return res.status(500).json(err)
            }

            if (result.length > 0) {
                const imgPath = path.join(
                    __dirname,
                    '../../public/img/event-pics',
                    result[0].event_img
                )
                try {
                    const imageBlob = getImageBlob(imgPath)

                    // Set the appropriate content type for the image
                    res.setHeader('Content-Type', 'image/jpeg') // Adjust the content type based on your image format

                    // Send the image binary data as the response
                    res.send(imageBlob)
                } catch (error) {
                    console.error('Error fetching image:', error)
                    res.status(500).send('Internal Server Error')
                }
            } else {
                return res.status(500).json(err)
            }
        }
    )
}



// Create and Update
const create_update = async (req, res) => {
    const { eventId, eventAuthor, eventDate, eventTime, eventTitle, eventDescription } =
        req.body

    try {
        const retrieveEvent = await getEventById(eventId)
        const image = req.file

        if (
            retrieveEvent.length > 0 &&
            retrieveEvent[0].hasOwnProperty('event_id')
        ) {
            // Update the existing event
            const eventImg = moveFileToDirectory(
                image,
                eventId,
                '../../public/img/event-pics'
            )
            db.query(
                `UPDATE event_i SET 
                        event_author = ?, 
                        event_date = ?,
                        event_time = ?,
                        event_title = ?, 
                        event_description = ?,
                        event_img = ?, 
                        event_datemodified = NOW()
                        WHERE event_id = ?`,
                [
                    eventAuthor,
                    eventDate,
                    eventTime,
                    eventTitle,
                    eventDescription,
                    eventImg,
                    eventId,
                ],
                (updateError, updateRes) => {
                    if (updateError) {
                        console.log(updateError)
                        return res
                            .status(500)
                            .json({ error: 'Failed to update event' })
                    }

                    if (updateRes.affectedRows > 0) {
                        // Move the file to the specified directory

                        return res
                            .status(200)
                            .json({ message: 'Event updated successfully' })
                    } else {
                        console.log(updateError)
                        return res
                            .status(500)
                            .json({ message: 'Failed to update event' })
                    }
                }
            )
        } else {
            const newId = uniqueId.uniqueIdGenerator()
            // Move the file to the specified directory
            const eventImg = moveFileToDirectory(
                image,
                newId,
                '../../public/img/event-pics'
            )
            db.query(
                `INSERT INTO event_i (
                    event_id, 
                    event_author, 
                    event_datecreated, 
                    event_date, 
                    event_time,
                    event_title, 
                    event_description, 
                    event_img) 
                    VALUES (?, ?, NOW(), ?, ?, ?, ?)`,
                [
                    newId,
                    eventAuthor,
                    eventDate,
                    eventTime,
                    eventTitle,
                    eventDescription,
                    eventImg,
                ],
                (eventUploadError, eventUploadResult) => {
                    if (eventUploadError) {
                        console.log(eventUploadError)
                        return res
                            .status(500)
                            .json({
                                error: 'Failed to upload event',
                                eventUploadError,
                            })
                    }

                    if (eventUploadResult.affectedRows > 0) {
                        return res
                            .status(200)
                            .json({ message: 'Event uploaded successfully' })
                    } else {
                        console.log(eventUploadError)
                        return res
                            .status(500)
                            .json({ message: 'Failed to update event' })
                    }
                }
            )
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error })
    }
}

// DELETE Event
const deleteEvent = async (req, res) => {
    const { eventId } = req.params

    try {
        const retrieveEvent = await getEventById(eventId)
        if (
            retrieveEvent.length > 0 &&
            retrieveEvent[0].hasOwnProperty('event_id')
        ) {
            db.query(
                'UPDATE event_i SET event_flag = 0 WHERE event_id = ?',
                [eventId],
                (eventDeleteError, eventDeleteResult) => {
                    if (eventDeleteError) {
                        return res
                            .status(500)
                            .json({ error: 'Failed to delete event' })
                    }

                    if (eventDeleteResult.affectedRows > 0) {
                        return res
                            .status(200)
                            .json({ message: 'Event deleted successfully' })
                    } else {
                        console.log(eventDeleteError)
                        return res
                            .status(500)
                            .json({ message: 'Failed to delete event' })
                    }
                }
            )
        } else {
            return res.status(500).json({ error: 'Event cannot be found!' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {
    event,
    events_user,
    fetchEventById,
    getEventImage,
    create_update,
    deleteEvent,
}
