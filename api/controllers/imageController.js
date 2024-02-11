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

        return newFileName
    } catch (error) {
        console.error('Error moving file:', error)
        throw error // You might want to handle or log the error appropriately
    }
}

const getImage = async (req, res) => {
    const { filePath } = req.query

    if (!filePath) {
        return res.status(400).json({ error: 'Missing filePath parameter' });
    }

    const [folder, filename] = filePath.split('/');
    const imgPath = path.join(__dirname, `../../public/img/${folder}`, filename);
    
    try {
        const imageBlob = getImageBlob(imgPath);

        // Set the appropriate content type for the image
        res.setHeader('Content-Type', 'image/jpeg, image/png, image/jpg');

        // Send the image binary data as the response
        res.send(imageBlob);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Internal Server Error');
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

function getFileExtensionFromDataURL(dataURL) {
    const match = dataURL.match(/^data:image\/([a-zA-Z+]+);base64,/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
}

const updateImage = async (req, res) => {
    const { filePath } = req.params;

    const OldimageId = path.basename(result[0].blog_img, path.extname(result[0].blog_img));
    let currentImg = result[0].blog_img;
    const oldImagePath = path.join(__dirname, `../../public/img/${filePath}`, result[0].blog_img);
    const base64Image = blogImg.split(';base64,').pop();
    const imageName = OldimageId + '.' + getFileExtensionFromDataURL(blogImg);
    const blogImgPath = path.join(__dirname, `../../public/img/${filePath}`, imageName);

    if (base64Image.length > 0) {
        fs.unlink(oldImagePath, (err) => {
            if (err) {
                console.error('Error deleting old blog image:', err);
            } else {
                fs.writeFile(blogImgPath, base64Image, { encoding: 'base64' }, function (err) {
                    if (err) {
                        console.log('Error saving blog image:', err);
                        return res.status(500).json({ error: 'Error saving blog image' });
                    } else {
                        currentImg = imageName;
                        updateBlog(db, result, blogTitle, blogContent, currentImg, authorId, blogId, username, res);
                    }
                });
            }
        });
    } else {
        updateBlog(db, result, blogTitle, blogContent, currentImg, authorId, blogId, username, res);
    }

}

module.exports = {
    getImage,
    uploadImage,
    updateImage
}
