const db = require('../../database/db');
const eventSanitizeInput = require('../middlewares/querySanitizerMiddleware');

// Event Finder by ID
const getEventById = async (eventId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM event_i WHERE event_id = ? ", [eventSanitizeInput(eventId)], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Event Reader
const eventFinder = async (req, res) => {
    const { eventId } = req.params;
    try {
        const result = await getEventById(eventId);
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.status(500).json({ error: 'Cannot fetch Event ID' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Create and Update
const createUpdateEvent = async (req, res) => {
    const { 
        eventId, 
        eventAuthor, 
        eventDate, 
        eventTitle, 
        eventDescription, 
        eventImg } = req.body;
    
    try {
        const retrieveEvent = await getEventById(eventId);

        if (retrieveEvent.length > 0 && retrieveEvent[0].hasOwnProperty('event_id')) {
            // Update the existing event
            db.query(`UPDATE event_i SET 
                        event_author = ?, 
                        event_date = ?,
                        event_title = ?, 
                        event_description = ?,
                        event_img = ?, 
                        event_datemodified = NOW()
                        WHERE event_id = ?`, 
                        [eventAuthor, eventDate, eventTitle, eventDescription, eventImg, eventId], 
            (updateError, updateRes) => {
                if (updateError) {
                    console.log(updateError)
                    return res.status(500).json({ error: 'Failed to update event' });
                }

                if (updateRes.affectedRows > 0) {
                    return res.status(200).json({ message: 'Event updated successfully' });
                } else {
                    console.log(updateError)
                    return res.status(500).json({ message: 'Failed to update event' });
                }
            });
        } else {
            db.query("INSERT INTO event_i (event_author, event_datecreated, event_date, event_title, event_description, event_img) VALUES (?, NOW(), ?, ?, ?, ?)", [eventAuthor, eventDate, eventTitle, eventDescription, eventImg], (eventUploadError, eventUploadResult) => {
                if (eventUploadError) {
                    console.log(eventUploadError)
                    return res.status(500).json({ error: 'Failed to upload event' });
                }

                if (eventUploadResult.affectedRows > 0) {
                    return res.status(200).json({ message: 'Event uploaded successfully' });
                } else {
                    console.log(eventUploadError)
                    return res.status(500).json({ message: 'Failed to update event' });
                }
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
        
    }
}

// DELETE Event
const deleteEvent = async (req, res) => {
    const {eventId} = req.params;

    try {
        const retrieveEvent = await getEventById(eventId);
        if (retrieveEvent.length > 0 && retrieveEvent[0].hasOwnProperty('event_id')) {
            db.query("DELETE FROM event_i WHERE event_id = ?", [eventId], (eventDeleteError, eventDeleteResult) => {
                if (eventDeleteError) {
                    return res.status(500).json({ error: 'Failed to delete event' });
                }

                if (eventDeleteResult.affectedRows > 0) {
                    return res.status(200).json({ message: 'Event deleted successfully' });
                } else {
                    console.log(eventDeleteError)
                    return res.status(500).json({ message: 'Failed to delete event' });
                }
            });
        } else {
            return res.status(500).json({ error: "Event cannot be found!" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    eventFinder,
    createUpdateEvent,
    deleteEvent
};