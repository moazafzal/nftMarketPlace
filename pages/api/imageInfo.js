import { IncomingForm } from 'formidable'


export const config = {
    api: {
       bodyParser: false,
    }
};
 
export default async (req, res) => {
    
    const data = await new Promise((resolve, reject) => {
       const form = new IncomingForm()
       
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            // console.log(fields, files)
            // console.log(files.file.filepath)
            // console.log(files.file.originalFilename)
            var oldPath = files.file.filepath;
            // var fileName = Math.random().toString(36).substr(2, 12)
            // var newPath = `./pages/api/blogImages/${fileName}.jpg`;
            // mv(oldPath, newPath, function(err) {
            // });
            res.status(200).json({ oldPath,fields, files,  success : true })
        })
    })
    
}