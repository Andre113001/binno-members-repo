const db = require('../../database/db');

// Middlewares
const sanitizeId = require('../middlewares/querySanitizerMiddleware');
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware');

// Fetch Schedule By ScheduleID
const getScheduleById = async (scheduleId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM schedule_i WHERE sched_id = ?', [sanitizeId(scheduleId)], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Fetch Schedules
const getSchedule = async (req, res) => {
    const { scheduleId } = req.params;
    try {
        const result = await getScheduleById(scheduleId);
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.status(404).json({ error: 'Schedule does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllSchedule = async (req, res) => {
    try {
        const result = db.query('SELECT * FROM schedule_i');
        if (result.length > 0) {
            return res.status(200).json({result : result});
        } else {
            return res.status(200).json({result : "No schedules"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Post, Update Schedule
const postSchedule = async (req, res) => {
    const { schedDate, schedRequestId, schedZoomLink } = req.body;

    try {
        const newId = uniqueId.uniqueIdGenerator();
            // Create a new schedule
            db.query('INSERT INTO schedule_i (sched_id, sched_dateadded, sched_date, sched_requestId, sched_zoomlink) VALUES (?, NOW(), ?, ?, ?)', [newId, schedDate, schedRequestId, schedZoomLink], (createError, createRes) => {
                if (createError) {
                    console.log(createError);
                    return res.status(500).json({ error: 'Failed to create schedule', reason: createError });
                }

                if (createRes.affectedRows > 0) {
                    return res.status(201).json({ message: 'Schedule created successfully' });
                } else {
                    return res.status(500).json({ error: 'Failed to create schedule' });
                }
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Update / Change Schedule
const changeSchedule = async (req, res) => {
    const { scheduleId, newDate } = req.body;

    try {
        const result = await getScheduleById(scheduleId);

        if (result.length > 0 && result[0].hasOwnProperty('sched_id')) {
            db.query("UPDATE schedule_i SET sched_date = ?, sched_datemodified = NOW() WHERE sched_id = ?", [newDate, sanitizeId(scheduleId)], (updateError, updateRes) => {
                if (updateError) {
                    console.log(updateError);
                    return res.status(500).json({ error: 'Failed to delete schedule' });
                }

                if (updateRes.affectedRows > 0) {
                    return res.status(200).json({ message: 'Schedule changed successfully' });
                } else {
                    return res.status(500).json({ error: 'Failed to change schedule' });
                }
            });
        } else {
            return res.status(404).json({ error: 'Schedule does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



// Delete Schedule
const deleteSchedule = async (req, res) => {
    const { scheduleId } = req.params;

    try {
        const result = await getScheduleById(scheduleId);

        if (result.length > 0 && result[0].hasOwnProperty('sched_id')) {
            db.query("UPDATE schedule_i SET sched_flag = 0 WHERE sched_id = ?", [sanitizeId(scheduleId)], (deleteError, deleteRes) => {
                if (deleteError) {
                    console.log(deleteError);
                    return res.status(500).json({ error: 'Failed to delete schedule' });
                }

                if (deleteRes.affectedRows > 0) {
                    return res.status(200).json({ message: 'Schedule deleted successfully' });
                } else {
                    return res.status(500).json({ error: 'Failed to delete schedule' });
                }
            });
        } else {
            return res.status(404).json({ error: 'Schedule does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getSchedule,
    getAllSchedule,
    postSchedule,
    changeSchedule,
    deleteSchedule,
};


