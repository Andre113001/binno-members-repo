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
            'SELECT * FROM event_i WHERE event_author = ? AND event_flag = 1 ORDER BY event_date DESC',
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

function getFileExtensionFromDataURL(dataURL) {
    const match = dataURL.match(/^data:image\/([a-zA-Z+]+);base64,/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
}


// Create and Update
const create_update = async (req, res) => {
    try {
        const { eventId, eventAuthor, eventDate, eventTime, eventLocation, eventTitle, eventDescription, eventImg } = req.body

        const retrieveEvent = await getEventById(eventId)
        const dateObject = new Date(eventDate);
        const eventObject = new Date(eventTime);
        const event_time = eventObject.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const formattedDate = dateObject.toISOString().split('T')[0];
        // const date = new Date(eventDate);

        if (retrieveEvent.length > 0 && retrieveEvent[0].hasOwnProperty('event_id')) {
            const OldimageId = path.basename(retrieveEvent[0].event_img, path.extname(retrieveEvent[0].event_img));
            let currentImg = retrieveEvent[0].event_img;
            // Delete the old image file
            const oldImagePath = path.join(__dirname, '../../public/img/event-pics/', retrieveEvent[0].event_img);
            
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
                        fs.writeFile(eventPicPath, base64Image, { encoding: 'base64' }, function (err) {
                            if (err) {
                                console.log('Error saving new profile image:', err);
                                success = false;
                            }
                        });
                    }
                });
                currentImg = imageName;
            }

            db.query(
                `UPDATE event_i SET 
                        event_address = ?,
                        event_date  = ?,
                        event_time  = ?,
                        event_title = ?, 
                        event_description = ?,
                        event_img = ?, 
                        event_datemodified = NOW()
                        WHERE event_id = ?`,
                [
                    eventLocation,
                    eventDate,
                    eventTime,
                    eventTitle,
                    eventDescription,
                    currentImg,
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
                            .json(true)
                    } else {
                        console.log(updateError)
                        return res
                            .json(false)
                    }
                }
            )
        } else {
            const newId = uniqueId.uniqueIdGenerator()

            db.query(
                `INSERT INTO event_i (
                    event_id, 
                    event_author, 
                    event_datecreated, 
                    event_address,
                    event_date, 
                    event_time,
                    event_title, 
                    event_description, 
                    event_img) 
                    VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
                [
                    newId,
                    eventAuthor,
                    eventLocation,
                    formattedDate,
                    event_time,
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
                        return res.json({ result: true })
                    } else {
                        console.log(eventUploadError)
                        return res.json({ result: false })
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
