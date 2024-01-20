const fs = require('fs')
const path = require('path')
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware')

const getImageBlob = (imagePath) => {
    return fs.readFileSync(imagePath)
}

// Function to move file to a specified directory
const moveFileToDirectory = (file, destinationDirectory) => {
    try {
        const newId = uniqueId.uniqueIdGenerator()
        const newFileName = `${newId}${path.extname(file.originalname)}`
        const filePath = path.join(__dirname, destinationDirectory, newFileName)

         // Create the destination directory if it doesn't exist
         if (!fs.existsSync(path.join(__dirname, destinationDirectory))) {
            fs.mkdirSync(path.join(__dirname, destinationDirectory), { recursive: true });
        }
        
        // Write the file, overwriting if it already exists
        fs.writeFileSync(filePath, file.buffer)

        return filePath
    } catch (error) {
        console.error('Error moving file:', error)
        throw error // You might want to handle or log the error appropriately
    }
}

const getImage = async (req, res) => {
    const { file_path } = req.params

    const decodedFilePath = decodeURIComponent(file_path);

    const imgPath = path.join(__dirname, `../../public/img/${decodedFilePath}`);
    try {
        const imageBlob = getImageBlob(imgPath)

        // Set the appropriate content type for the image
        res.setHeader('Content-Type', 'image/jpeg, image/png, image/jpg')

        // Send the image binary data as the response
        res.send(imageBlob)
    } catch (error) {
        console.error('Error fetching image:', error)
        res.status(500).send('Internal Server Error')
    }
}

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }

        const { file_path } = req.body
        const image = req.file

        // Move the file to the specified directory
        const eventImgPath = moveFileToDirectory(
            image,
            `../../public/img/${file_path}`
        )
        

        return res.status(200).json({
            message: 'File uploaded successfully',
            filePath: eventImgPath,
        })
    } catch (error) {
        console.error('Error uploading image:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getImage,
    uploadImage,
}
