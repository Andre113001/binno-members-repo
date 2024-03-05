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
const { updateContentStat } = require('../middlewares/contentStatUpdater');

// Reusable function to get a program by ID
// NOTE: should be renamed as fetchGuideById() - AL
const fetchProgramById = (programId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const getGuideById = `
            SELECT program_i.* FROM program_i INNER JOIN member_i ON member_i.member_id = program_i.program_author
            WHERE program_id = ? AND member_restrict IS NULL AND member_flag = 1 ORDER BY program_dateadded DESC
        `;
        // NOTE: new query for the new database - AL
        // const getGuideById = `
        //     SELECT * FROM guide
        //     WHERE guide_id = ?
        //     ORDER BY date_created DESC
        // `;
        db.query(getGuideById, [sanitizeId(programId)], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data[0])
            }
        })
    })
}

// NOTE: should be renamed as fetchAllGuides()
const allPrograms = async (req, res) => {
    const programs = await new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const getAllGuidesQuery = `
            SELECT program_i.* FROM program_i INNER JOIN member_i ON member_i.member_id = program_i.program_author WHERE program_flag = 1 AND member_restrict IS NULL AND member_flag = 1 ORDER BY program_dateadded DESC
        `;
        // NOTE: new query for the new database - AL
        // const getAllGuidesQuery = `
        //     SELECT * FROM guide
        //     WHERE archive = 0
        //     ORDER BY date_created DESC
        // `;
        db.query(getAllGuidesQuery, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

    if (programs.length > 0) {
        res.status(200).send(programs)
    } else {
        res.status(404).send([])
    }
}

// Function to fetch a program page by ID
// NOTE: should be renamed to fetchGuidePagesById() - AL
const fetchProgramPageById = (programPageId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const getGuidePagesByIdQuery = `
            SELECT * FROM program_pages WHERE program_pages_id = ?
        `;
        // NOTE: new query for the new database - AL
        // const getGuidePagesByIdQuery = `
        //     SELECT * FROM guide_page WHERE guide_page_id = ?
        // `;
        db.query(getGuidePagesByIdQuery, [sanitizeId(programPageId)], async (err, data) => {
            if (err) {
                reject(err)
            } else {
                if (data.length === 0) {
                    resolve([])
                } else {
                    // console.log(data);
                    const elementsData = await readElements(
                        data[0].program_pages_path
                    )
                    resolve({ ...data[0], elements: elementsData })
                    // resolve({ ...data[0], elements: elementsData })
                }
            }
        })
    })
}

// Function to fetch a program page by ID
// NOTE: should be renamed to fetchGuidePagesByIdDesc() - AL
const fetchProgramPageElements = (programPageId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const getGuidePagesByIdQuery = `
            SELECT * FROM program_pages
            WHERE program_pages_id = ?
            ORDER BY program_pages_dateadded DESC
        `;
        // NOTE: new query for the new database - AL
        // const getGuidePagesByIdQuery = `
        //     SELECT * FROM guide_page
        //     WHERE guide_page_id = ?
        //     ORDER BY date_created DESC
        // `;
        db.query(getGuidePagesByIdQuery, [sanitizeId(programPageId)], async (err, data) => {
            if (err) {
                reject(err)
            } else {
                // console.log(programPageId)
                if (data.length === 0) {
                    resolve([])
                } else {
                    const elementsData = await readElements(
                        data[0].program_pages_path
                    )
                    resolve(elementsData)
                    // resolve({ ...data[0], elements: elementsData })
                }
            }
        })
    })
}

// Function to fetch a program page by ID
// NOTE: should be renamed to fetchGuidePagesByGuideId()
const fetchProgramPages = (programPageId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const getGuidePagesByGuideIdQuery = `
            SELECT program_pages.*, program_i.program_img FROM program_pages
            INNER JOIN program_i ON program_i.program_id = program_pages.program_id
            WHERE program_pages.program_id = ? AND program_pages.program_pages_flag = 1
            ORDER BY program_pages.program_pages_dateadded ASC
        `;
        // NOTE: new query for the new database - AL
        // const getGuidePagesByGuideIdQuery = `
        //     SELECT * FROM guide_page
        //     WHERE guide_id = ? AND archive = 0
        //     ORDER BY date_created ASC
        // `;
        db.query(getGuidePagesByGuideIdQuery, [sanitizeId(programPageId)], async (err, data) => {
            if (err) {
                reject(err)
            } else {
                if (data.length === 0) {
                    resolve([])
                } else {
                    const updatedData = await Promise.all(
                        (data || []).map(async (program) => {
                            const elements = await fetchProgramPageElements(
                                program.program_pages_id
                            )
                            return { ...program, elements: elements }
                        })
                    )

                    const elementsData = await readElements(
                        data[0].program_pages_path
                    )
                    resolve(updatedData)
                }
            }
        })
    })
}

// Fetch All programs
// NOTE: should be renamed as fetchAllGuidesByAuthor()
const fetchAllPrograms = async (req, res) => {
    const { id } = req.params

    const getGuidesByAuthorID = `
        SELECT * FROM program_i WHERE
        program_author = ? AND program_flag = 1
        ORDER BY program_dateadded DESC
    `;
    // NOTE: new query for the new database - AL
    // const getGuidesByAuthorID = `
    //     SELECT * FROM guide WHERE
    //     author_id = ? AND archive = 0
    //     ORDER BY date_created DESC
    // `;
    db.query(getGuidesByAuthorID, [sanitizeId(id)], (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).json({
                error: 'Error fetching programs',
                details: err,
            })
        } else {
            res.status(200).json(data)
        }
    })
}

// Find Program
// NOTE: should be renamed as fetchGuide() - AL
const fetchProgram = async (req, res) => {
    const { program_id } = req.params

    try {
        const fetchProgramResult = await fetchProgramById(program_id)
        const fetchProgramPagesResult = await fetchProgramPages(program_id)
        if (fetchProgramResult) {
            return res.status(200).json({
                ...fetchProgramResult,
                program_pages: fetchProgramPagesResult,
            })
        } else {
            return res.status(500).json({ error: 'Program does not exist' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error', error })
    }
}

// Controller to save elements by ID
const saveElementsController = async (req, res) => {
    const { pageId } = req.params
    const { newFile } = req.body

    const result = await saveElements(pageId, newFile)

    if (result.success) {
        res.status(200).json(result)
    } else {
        res.status(500).json(result)
    }
}

// Fetch Program Page
const fetchProgramPage = async (req, res) => {
    const { pageId } = req.params

    try {
        const fetchPageResult = await fetchProgramPageById(pageId)
        if (fetchPageResult) {
            return res.status(200).json(fetchPageResult)
        } else {
            return res.status(500).json({ error: 'Page does not exist' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error', error })
    }
}

// Create & Update program
// NOTE: should be renamed to createGuide() - AL
const createProgram = async (req, res) => {
    const { programAuthor, fileName, programTitle } =
        req.body

    try {
        const newId = uniqueId.uniqueIdGenerator()

        // Create a new blog
        const createGuideQuery = `
            INSERT INTO program_i (
                program_id,
                program_dateadded,
                program_author,
                program_heading,
                program_img
            )
            VALUES (?, NOW(), ?, ?, ?)
        `;
        // NOTE: new query for the new database - AL
        // const createGuideQuery = `
        //     INSERT INTO guide (
        //         guide_id,
        //         date_created,
        //         author_id,
        //         title,
        //         image
        //     )
        //     VALUES (?, NOW(), ?, ?, ?)
        // `;
        db.query(
            createGuideQuery, [newId, programAuthor, programTitle, fileName],
            (createError, createRes) => {
                if (createError) {
                    return res.status(500).json({
                        error: 'Failed to create Program',
                        createError,
                    })
                }

                if (createRes.affectedRows > 0) {
                    updateContentStat('guide');
                    return res
                        .status(201)
                        .json({ message: 'Program created successfully', id: newId })
                } else {
                    return res.status(500).json({
                        error: 'Failed to create program',
                        createError,
                    })
                }
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
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
const createUpdatePage = async (req, res) => {
    const { pageId, pageProgramId, pageTitle, pagePath } = req.body

    try {
        const fetchProgramResult = await fetchProgramPageById(pageId)

        if (fetchProgramResult.length > 0) {
            // Update Program
            const updateGuidePageQuery = `
                UPDATE program_pages SET
                program_id = ?,
                program_pages_title = ?,
                program_pages_path = ?,
                program_pages_datemodified = NOW()
                WHERE program_pages_id = ?
            `
            // NOTE: new query for the new database - AL
            // const updateGuidePageQuery = `
            //     UPDATE guide_page SET
            //     guide_id = ?,
            //     title = ?,
            //     filename = ?,
            //     date_modified = NOW()
            //     WHERE guide_page_id = ?
            // `;
            db.query(updateGuidePageQuery, [pageProgramId, pageTitle, pagePath, pageId],
                (err, result) => {
                    if (err) {
                        return res
                            .status(500)
                            .json({ error: 'Failed to update page', err })
                    }

                    if (result.affectedRows > 0) {
                        return res
                            .status(200)
                            .json({ message: 'Page updated successfully' })
                    } else {
                        return res
                            .status(500)
                            .json({ message: 'Failed to update page', err })
                    }
                }
            )
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
                    return res.status(500).json({
                        error: 'Failed to create JSON file',
                        err,
                    });
                }

                // Continue with the database query
                // Insert the program_pages_path as the <insert newId>.json
                const createGuidePageQuery = `
                    INSERT INTO program_pages (
                        program_pages_id,
                        program_id,
                        program_pages_dateadded,
                        program_pages_title,
                        program_pages_path
                    )
                    VALUES (?, ?, NOW(), ?, ?)
                `;
                // NOTE: new query for the new database - AL
                // const createGuidePageQuery = `
                //     INSERT INTO guide_page (
                //         guide_page_id,
                //         guide_id,
                //         date_created,
                //         title,
                //         filename
                //     )
                //     VALUES (?, ?, NOW(), ?, ?)
                // `;
                db.query(
                    createGuidePageQuery, [newId, pageProgramId, 'Untitled', fileName], // Use the filePath as the program_pages_path
                    (createError, createRes) => {
                        if (createError) {
                            return res.status(500).json({
                                error: 'Failed to create Page',
                                createError,
                            });
                        }

                        if (createRes.affectedRows > 0) {
                            return res.json('Page created successfully');
                        } else {
                            return res.status(500).json({
                                error: 'Failed to create page',
                                createError,
                            });
                        }
                    }
                );
            });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

// Delete Program
// NOTE: should be renamed to deleteGuide() - AL
const deleteProgam = async (req, res) => {
    const { program_id } = req.params;
    const { username } = req.body;

    try {
        const result = await fetchProgramById(program_id)

        if (result) {
            const deleteGuideQuery = `
                UPDATE program_i SET program_flag = 0 WHERE program_id = ?
            `;
            // NOTE: new query for the new database - AL
            // const deleteGuideQuery = `
            //     UPDATE guide SET archive = 1 WHERE guide_id = ?
            // `;
            db.query(
                deleteGuideQuery, [program_id], (deleteError, deleteRes) => {
                    if (deleteError) {
                        console.log(deleteError)
                        return res.status(500).json({
                            error: 'Failed to delete program',
                            deleteError,
                        })
                    }

                    if (deleteRes.affectedRows > 0) {
                        return res.json({ message: 'Program deleted successfully' })
                    } else {
                        return res.status(500).json({
                            error: 'Failed to delete program',
                            deleteError,
                        })
                    }
                }
            )
        } else {
            return res.status(500).json({ error: 'Program does not exist!' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

// Delete Page
// NOTE: should be renamed to deleteGuidePage()
const deletePage = async (req, res) => {
    const { page_id } = req.params;

    try {
        // Fetch the program page by ID to get the corresponding file path
        const result = await fetchProgramPageById(page_id);

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
    fetchProgram,
    fetchProgramPage,
    saveElementsController,
    fetchAllPrograms,
    changeCoverPic,
    changeTitlePage,
    createProgram,
    createUpdatePage,
    deleteProgam,
    deletePage,
    allPrograms,
}
