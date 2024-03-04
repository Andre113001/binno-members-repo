// WARN: file might be renamed to guideController.js - AL
// because program is not called guide

const db = require('../../database/db')

// Middlewares
const { readElements, saveElements } = require('../utils/elementsUtility')
const sanitizeId = require('../middlewares/querySanitizerMiddleware')
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware')
const sha256 = require('sha256')
const fs = require('fs');
const path = require('path');
const { updateContentStat, deductContentStat } = require("../middlewares/contentStatUpdater");

/**
 * Fetches guide information by its unique identifier from the database.
 *
 * @function
 * @param {string} programId - The unique identifier of the guide to fetch.
 * @returns {Promise<Object>} A promise that resolves with the retrieved guide information or rejects with an error.
 */
const fetchGuideById = (programId) => {
    console.log(`fetchGuideById(${programId})`)
    return new Promise((resolve, reject) => {
        const fetchGuideByIdQuery = `
            SELECT guide.* FROM guide
            INNER JOIN member_profile ON member_profile.member_id = guide.author_id
            WHERE member_profile.date_restrict IS NULL AND member_profile.archive = 0
            AND guide.guide_id = ? AND guide.archive = 0
            ORDER BY date_created DESC
        `;
        db.query(fetchGuideByIdQuery, [sanitizeId(programId)], (fetchError, fetchData) => {
            if (fetchError) {
                reject(fetchError)
            } else {
                resolve(fetchData[0])
            }
        });
    });
}

/**
 * Retrieves all guides from the database and sends them as a JSON response.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the guides, the database query, or any other error occurs.
 * @returns {void} Sends the retrieved guides as a JSON response or an empty array if no guides are found.
 */
const getAllGuides = async (req, res) => {
    console.log(`getAllGuides() from ${req.ip}`);
    const programs = await new Promise((resolve, reject) => {
        const getAllGuidesQuery = `
            SELECT guide.* FROM guide
            INNER JOIN member_profile ON member_profile.member_id = guide.author_id
            WHERE guide.archive = 0 AND member_profile.date_restrict IS NULL AND member_profile.archive = 0
            ORDER BY date_created DESC
        `;
        db.query(getAllGuidesQuery, (getError, getData) => {
            if (getError) {
                reject(getError);
            } else {
                resolve(getData);
            }
        });
    });

    if (programs.length > 0) {
        res.status(200).send(programs);
    } else {
        res.status(404).send([]);
    }
}

/**
 * Fetches a specific guide page by its unique identifier from the database.
 *
 * @function
 * @param {string} guidePageId - The unique identifier of the guide page to fetch.
 * @returns {Promise<Object>} A promise that resolves with the guide page and its elements or rejects with an error.
 */
const fetchGuidePageByPageId = (guidePageId) => {
    console.log(`fetchGuidePageByPageId(${guidePageId})`);
    return new Promise((resolve, reject) => {
        const getGuidePagesByIdQuery = `
            SELECT * FROM guide_page WHERE guide_page_id = ? AND archive = 0
        `;
        db.query(getGuidePagesByIdQuery, [sanitizeId(guidePageId)], async (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (data.length === 0) {
                    resolve([]);
                } else {
                    const elementsData = await readElements(data[0].filename);
                    resolve({ ...data[0], elements: elementsData });
                }
            }
        });
    });
}

/**
 * Fetches page elements associated with a specific guide page from the database.
 *
 * @function
 * @param {string} guidePageId - The unique identifier of the guide page for which to fetch elements.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of page elements or rejects with an error.
 */
const fetchPageElementsByPageId = (guidePageId) => {
    console.log(`fetchPageElementsByPageId(${guidePageId})`);
    return new Promise((resolve, reject) => {
        const getGuidePagesByIdQuery = `
            SELECT * FROM guide_page
            WHERE guide_page_id = ?
            ORDER BY date_created DESC
        `;
        db.query(getGuidePagesByIdQuery, [sanitizeId(guidePageId)], async (err, data) => {
            if (err) {
                reject(err)
            } else {
                if (data.length === 0) {
                    resolve([])
                } else {
                    const elementsData = await readElements(data[0].filename);
                    resolve(elementsData)
                }
            }
        });
    });
}

/**
 * Fetches guide pages associated with a specific guide from the database.
 *
 * @function
 * @param {string} guideId - The unique identifier of the guide for which to fetch pages.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of guide pages or rejects with an error.
 */
const fetchGuidePagesByGuideId = (guideId) => {
    console.log(`fetchGuidePagesByGuideId(${guideId})`);
    return new Promise((resolve, reject) => {
        const getGuidePagesByGuideIdQuery = `
            SELECT * FROM guide_page
            WHERE guide_id = ? AND archive = 0
            ORDER BY date_created ASC
        `;
        db.query(getGuidePagesByGuideIdQuery, [sanitizeId(guideId)], async (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (data.length == 0) {
                    resolve([]);
                } else {
                    const updatedData = await Promise.all((data || []).map(async (guide) => {
                        const elements = await fetchPageElementsByPageId(guide.guide_page_id);
                        return { ...guide, elements: elements };
                    }));
                    resolve(updatedData);
                }
            }
        });
    })
}

/**
 * Retrieves all guides authored by a specific user from the database and sends them as a JSON response.
 *
 * @function
 * @param {Object} req - Express request object with parameters.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.authorId - The unique identifier of the author for whom to retrieve guides.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the guides, the database query, or any other error occurs.
 * @returns {void} Sends the retrieved guides as a JSON response or an error status with details.
 */
const getAllGuidesByAuthorId = async (req, res) => {
    console.log(`getAllGuidesByAuthorId() from ${req.ip}`);
    const { authorId } = req.params;
    const getGuidesByAuthorIDQuery = `
        SELECT guide.* FROM guide
        inner join member_profile on member_profile.member_id = guide.author_id
        WHERE guide.author_id = ? AND guide.archive = 0
        AND member_profile.date_restrict IS NULL AND member_profile.archive = 0
        ORDER BY date_created DESC
    `;
    db.query(getGuidesByAuthorIDQuery, [sanitizeId(authorId)], (getError, getData) => {
        if (getError) {
            console.error(getError)
            res.status(500).json({
                error: 'Error fetching programs',
                details: getError,
            });
        } else {
            res.status(200).json(getData);
        }
    });
}

/**
 * Retrieves guide information and its associated pages by its unique identifier from the database.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with parameters.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.guideId - The unique identifier of the guide to retrieve.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the guide or its pages, the database query, or any other error occurs.
 * @returns {void} Sends the retrieved guide information and pages as a JSON response or an error status.
 */
const getGuide = async (req, res) => {
    console.log(`getGuide() from ${req.ip}`);
    const { guideId } = req.params

    try {
        const fetchGuideResult = await fetchGuideById(guideId)
        const fetchGuidePagesResult = await fetchGuidePagesByGuideId(guideId)
        if (fetchGuideResult) {
            return res.status(200).json({
                ...fetchGuideResult,
                guidePages: fetchGuidePagesResult,
            })
        } else {
            console.log(`Guide (${guideId}) does not exist`);
            return res.status(404).json({ error: 'Guide does not exist' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

/**
 * Saves elements for a specific guide page in the database.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with parameters and body.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.pageId - The unique identifier of the guide page for which to save elements.
 * @param {Object} req.body - The request body containing the new elements data.
 * @param {Object} req.body.newFile - The new elements data to be saved.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with saving the guide page elements or any other error occurs.
 * @returns {void} Sends a JSON response indicating the success or failure of the operation.
 */
const saveGuidePageElements = async (req, res) => {
    const { pageId } = req.params;
    const { newFile } = req.body;

    const result = await saveElements(pageId, newFile);

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(500).json(result);
    }
}

/**
 * Retrieves a specific guide page by its unique identifier from the database and sends it as a JSON response.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with parameters.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.pageId - The unique identifier of the guide page to retrieve.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the guide page, the database query, or any other error occurs.
 * @returns {void} Sends the retrieved guide page as a JSON response or an error status with details.
 */
const getGuidePageByPageId = async (req, res) => {
    console.log(`getGuidePageByPageId() from ${req.ip}`);
    const { pageId } = req.params;

    try {
        const fetchPageResult = await fetchGuidePageByPageId(pageId);
        if (fetchPageResult) {
            return res.status(200).json(fetchPageResult);
        } else {
            console.error(`Guide page (${pageId}) does not exist`);
            return res.status(404).json({ error: 'Guide Page does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', error });
    }
}

/**
 * Creates a new guide in the database with the provided information.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with body.
 * @param {Object} req.body - The request body containing information to create the guide.
 * @param {string} req.body.guideAuthor - The unique identifier of the guide's author.
 * @param {string} req.body.fileName - The image filename associated with the guide.
 * @param {string} req.body.guideTitle - The title of the guide.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with creating the guide or any other error occurs.
 * @returns {void} Sends a JSON response indicating the success or failure of the guide creation.
 */
const createGuide = async (req, res) => {
    console.log(`createGuide() from ${req.ip}`);
    const { guideAuthor, fileName, guideTitle } = req.body;

    try {
        const newId = uniqueId.uniqueIdGenerator()
        const createGuideQuery = `
            INSERT INTO guide (
                guide_id,
                date_created,
                author_id,
                title,
                image
            )
            VALUES (?, NOW(), ?, ?, ?)
        `;
        db.query(createGuideQuery, [newId, guideAuthor, guideTitle, fileName], (createError, createRes) => {
            if (createError) {
                console.log(createError);
                return res.status(501).json({ error: 'Failed to create Guide' });
            }

            if (createRes.affectedRows > 0) {
                console.log(`Guide (${newId}) created successfully`);
                updateContentStat("guide");
                return res.status(201).json({ message: 'Guide created successfully' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// NOTE: should be renamed to changeGuideImage() or changeGuidePic()
const changeCoverPic = async (req, res) => {
    const { id, newCoverPic } = req.body;
    const changeGuideImageQuery = `
        UPDATE program_i SET
        program_img = ?,
        program_datemodified = NOW()
        WHERE program_id = ?
    `;
    // NOTE: new query for the new database - AL
    // const changeGuideImageQuery = `
    //     UPDATE guide SET
    //     image = ?,
    //     date_modified = NOW()
    //     WHERE program_id = ?
    // `;
    try {
        db.query(changeGuideImageQuery, [newCoverPic, id], (err, result) => {
            if (err) {
                console.log(err);
            }

            if (result.affectedRows > 0) {
                res.json(true)
            } else {
                res.json(false)
            }
        })

    } catch (error) {
        console.log('error: ', error);
    }
}

// NOTE: should be renamed to changeGuidePageTitle()
const changeTitlePage = async (req, res) => {
    const { pageProgramId, newPageTitle } = req.body;
    try {
        const changeGuidePageTitleQuery = `
            UPDATE program_pages SET
            program_pages_title = ?,
            program_pages_datemodified = NOW()
            WHERE program_pages_id = ?
        `;
        // NOTE: new query for the new database - AL
        // const changeGuidePageTitleQuery = `
        //     UPDATE guide_page SET
        //     title = ?,
        //     date_modified = NOW()
        //     WHERE guide_page_id = ?
        // `;
        db.query(changeGuidePageTitleQuery, [newPageTitle, pageProgramId], (err, result) => {
            if (err) {
                console.log(err);
            }

            if (result.affectedRows > 0) {
                res.json(true)
            } else {
                res.json(false)
            }
        })

    } catch (error) {
        console.log('error: ', error);
    }
}

// Create & Update Pages
const createUpdateGuidePage = async (req, res) => {
    console.log(`createUpdateGuidePage() from ${req.ip}`);
    const { pageId, pageGuideId, pageTitle, pagePath } = req.body

    try {
        const fetchGuidePageResult = await fetchGuidePageByPageId(pageId);
        console.log(fetchGuidePageResult);

        // old condition (fetchGuidePageResult.length > 0)
        if (fetchGuidePageResult) {
            const updateGuidePageQuery = `
                UPDATE guide_page SET
                guide_id = ?,
                title = ?,
                filename = ?,
                date_modified = NOW()
                WHERE guide_page_id = ?
            `;
            db.query(updateGuidePageQuery, [pageGuideId, pageTitle, pagePath, pageId], (updateError, updateResult) => {
                if (updateError) {
                    console.log(`Blog (${pageId}) updated failed`);
                    console.error(updateError);
                    return res.status(501).json({ error: 'Failed to update page' });
                }

                if (updateResult.affectedRows > 0) {
                    console.log(`Guide page (${pageId}) updated successfully`);
                    return res.status(200).json({ message: 'Guide page updated successfully' });
                }
            });
        } else {
            // Generate a new unique ID
            const newId = uniqueId.uniqueIdGenerator();
            const fileName = `${newId}.json`;

            // Define the file path for the new JSON file
            const filePath = path.join(__dirname, `../../public/guide-pages/`, fileName);

            // Create an empty array as JSON data
            const jsonData = '[]';

            // Write the JSON data to the file
            fs.writeFile(filePath, jsonData, (err) => {
                if (err) {
                    console.error('Error creating JSON file:', err);
                    return res.status(501).json({ error: 'Failed to create JSON file' });
                }

                // Continue with the database query
                // Insert the program_pages_path as the <insert newId>.json
                // const createGuidePageQuery = `
                //     INSERT INTO program_pages (
                //         program_pages_id,
                //         program_id,
                //         program_pages_dateadded,
                //         program_pages_title,
                //         program_pages_path
                //     )
                //     VALUES (?, ?, NOW(), ?, ?)
                // `;
                // NOTE: new query for the new database - AL
                const createGuidePageQuery = `
                    INSERT INTO guide_page (
                        guide_page_id,
                        guide_id,
                        date_created,
                        title,
                        filename
                    )
                    VALUES (?, ?, NOW(), ?, ?)
                `;
                db.query(createGuidePageQuery, [newId, pageGuideId, 'Untitled', fileName], (createError, createRes) => {
                    if (createError) {
                        console.error(createError);
                        return res.status(501).json({ error: 'Failed to create Guide page' });
                    }

                    if (createRes.affectedRows > 0) {
                        console.log(`Guide page (${newId}) created successfully`);
                        return res.json('Guide page created successfully');
                    }
                });
            });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

// Delete Program
// NOTE: should be renamed to deleteGuide() - AL
const deleteGuide = async (req, res) => {
    const { guideId } = req.params;

    try {
        const result = await fetchGuideById(guideId);

        if (result) {
            const deleteGuideQuery = `
                UPDATE guide SET archive = 1 WHERE guide_id = ?
            `;
            db.query(deleteGuideQuery, [guideId], (deleteError, deleteRes) => {
                if (deleteError) {
                    console.log(`Guide (${guideId}) delete failed`);
                    console.log(deleteError);
                    return res.status(501).json({ error: 'Failed to delete program' });
                }

                if (deleteRes.affectedRows > 0) {
                    const guideDateCreated = result.date_created.toISOString().split("T")[0];
                    deductContentStat(guideDateCreated, "guide");
                    console.log(`Guide (${guideId}) deleted successfully`);
                    return res.json({ message: 'Guide deleted successfully' });
                }
            });
        } else {
            console.log(`Guide (${guideId}) does not exist`);
            return res.status(404).json({ error: 'Guide does not exist!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete Page
// NOTE: should be renamed to deleteGuidePage()
const deletePage = async (req, res) => {
    const { page_id } = req.params;

    try {
        // Fetch the program page by ID to get the corresponding file path
        const result = await fetchGuidePageByPageId(page_id);

        if (result) {
            const filePath = path.join(__dirname, `../../public/guide-pages/`, `${page_id}.json`);

            // Delete the JSON file
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting JSON file:', err);
                    return res.status(500).json({
                        error: 'Failed to delete JSON file',
                        err,
                    });
                }

                // Continue with deleting the page from the database
                const deleteGuidePageQuery = `
                    DELETE FROM program_pages WHERE program_pages_id = ?
                `;
                // NOTE: new query for the new database - AL
                // const deleteGuidePageQuery = `
                //     UPDATE guide_page SET archive = 1 WHERE guide_page_id = ?
                // `;
                db.query(
                    deleteGuidePageQuery, [page_id],
                    (deleteError, deleteRes) => {
                        if (deleteError) {
                            console.error(deleteError);
                            return res.status(500).json({
                                error: 'Failed to delete program page',
                                deleteError,
                            });
                        }

                        if (deleteRes.affectedRows > 0) {
                            return res.status(201).json({ message: 'Page deleted successfully' });
                        } else {
                            return res.status(500).json({
                                error: 'Failed to delete page',
                                deleteError,
                            });
                        }
                    }
                );
            });
        } else {
            return res.status(500).json({ error: 'Page does not exist!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getGuide,
    getGuidePageByPageId,
    saveGuidePageElements,
    getAllGuidesByAuthorId,
    changeCoverPic,
    changeTitlePage,
    createGuide,
    createUpdateGuidePage,
    deleteGuide,
    deletePage,
    getAllGuides,
}
