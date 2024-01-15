const db = require('../../database/db')

// Middlewares
const { readElements, saveElements } = require('../utils/elementsUtility')
const sanitizeId = require('../middlewares/querySanitizerMiddleware')
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware')
const sha256 = require('sha256')

// Reusable function to get a program by ID
const fetchProgramById = (programId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
        SELECT * FROM program_i
        WHERE program_id = ?`
        db.query(sql, [sanitizeId(programId)], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data[0])
            }
        })
    })
}

const allPrograms = async (req, res) => {
    const programs = await new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
        SELECT * FROM program_i WHERE program_flag = 1`
        db.query(sql, (err, data) => {
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
const fetchProgramPageById = (programPageId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT * FROM program_pages WHERE program_pages_id = ?`
        db.query(sql, [sanitizeId(programPageId)], async (err, data) => {
            if (err) {
                reject(err)
            } else {
                console.log(programPageId)
                if (data.length === 0) {
                    resolve([])
                } else {
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
const fetchProgramPageElements = (programPageId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT * FROM program_pages WHERE program_pages_id = ?`
        db.query(sql, [sanitizeId(programPageId)], async (err, data) => {
            if (err) {
                reject(err)
            } else {
                console.log(programPageId)
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
const fetchProgramPages = (programPageId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT * FROM program_pages WHERE program_id = ?`
        db.query(sql, [sanitizeId(programPageId)], async (err, data) => {
            if (err) {
                reject(err)
            } else {
                if (data.length === 0) {
                    resolve([])
                } else {
                    console.log(data)

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
const fetchAllPrograms = async (req, res) => {
    const { id } = req.params

    const sql = `SELECT * FROM program_i WHERE program_author = ?`

    db.query(sql, [sanitizeId(id)], (err, data) => {
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
const createUpdateProgram = async (req, res) => {
    const { programId, programAuthor, programHeading, programDescription } =
        req.body

    try {
        const fetchProgramResult = await fetchProgramById(programId)

        if (fetchProgramResult.length > 0) {
            // Update Program
            db.query(
                'UPDATE program_i SET program_heading = ?, program_description = ?, program_datemodified = NOW() WHERE program_id = ?',
                [programHeading, programDescription, programId],
                (err, result) => {
                    if (err) {
                        return res
                            .status(500)
                            .json({ error: 'Failed to update program', err })
                    }

                    if (result.affectedRows > 0) {
                        return res
                            .status(200)
                            .json({ message: 'Program updated successfully' })
                    } else {
                        return res
                            .status(500)
                            .json({ message: 'Failed to update progaram', err })
                    }
                }
            )
        } else {
            const newId = uniqueId.uniqueIdGenerator()
            // Create a new blog
            db.query(
                'INSERT INTO program_i (program_id, program_dateadded, program_author, program_heading, program_description) VALUES (?, NOW(), ?, ?, ?)',
                [newId, programAuthor, programHeading, programDescription],
                (createError, createRes) => {
                    if (createError) {
                        return res.status(500).json({
                            error: 'Failed to create Program',
                            createError,
                        })
                    }

                    if (createRes.affectedRows > 0) {
                        return res
                            .status(201)
                            .json({ message: 'Program created successfully' })
                    } else {
                        return res.status(500).json({
                            error: 'Failed to create program',
                            createError,
                        })
                    }
                }
            )
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

// Create & Update Pages
const createUpdatePage = async (req, res) => {
    const { pageId, pageProgramId, pageTitle, pagePath } = req.body

    try {
        const fetchProgramResult = await fetchProgramPageById(pageId)

        if (fetchProgramResult.length > 0) {
            // Update Program
            db.query(
                'UPDATE program_pages SET program_id = ?, program_pages_title = ?, program_pages_path = ?, program_pages_datemodified = NOW() WHERE program_pages_id = ?',
                [pageProgramId, pageTitle, pagePath, pageId],
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
            const newId = uniqueId.uniqueIdGenerator()
            // Create a new blog
            db.query(
                'INSERT INTO program_pages (program_pages_id, program_id, program_pages_dateadded, program_pages_title, program_pages_path) VALUES (?, ?, NOW(), ?, ?)',
                [newId, pageProgramId, pageTitle, pagePath],
                (createError, createRes) => {
                    if (createError) {
                        return res.status(500).json({
                            error: 'Failed to create Page',
                            createError,
                        })
                    }

                    if (createRes.affectedRows > 0) {
                        return res
                            .status(201)
                            .json({ message: 'Page created successfully' })
                    } else {
                        return res.status(500).json({
                            error: 'Failed to create page',
                            createError,
                        })
                    }
                }
            )
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

// Delete Program
const deleteProgam = async (req, res) => {
    const { program_id } = req.params

    try {
        const result = await fetchProgramById(program_id)

        if (result.length > 0) {
            db.query(
                'DELETE FROM program_i WHERE program_id = ?',
                [program_id],
                (deleteError, deleteRes) => {
                    if (deleteError) {
                        console.log(deleteError)
                        return res.status(500).json({
                            error: 'Failed to delete program',
                            deleteError,
                        })
                    }

                    if (deleteRes.affectedRows > 0) {
                        return res
                            .status(201)
                            .json({ message: 'Program deleted successfully' })
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
const deletePage = async (req, res) => {
    const { page_id } = req.params

    try {
        const result = await fetchProgramPageById(page_id)

        if (result.length > 0) {
            db.query(
                'DELETE FROM program_pages WHERE program_pages_id = ?',
                [page_id],
                (deleteError, deleteRes) => {
                    if (deleteError) {
                        console.log(deleteError)
                        return res.status(500).json({
                            error: 'Failed to delete program page',
                            deleteError,
                        })
                    }

                    if (deleteRes.affectedRows > 0) {
                        return res
                            .status(201)
                            .json({ message: 'Page deleted successfully' })
                    } else {
                        return res.status(500).json({
                            error: 'Failed to delete page',
                            deleteError,
                        })
                    }
                }
            )
        } else {
            return res.status(500).json({ error: 'Page does not exist!' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {
    fetchProgram,
    fetchProgramPage,
    saveElementsController,
    fetchAllPrograms,
    createUpdateProgram,
    createUpdatePage,
    deleteProgam,
    deletePage,
    allPrograms,
}
