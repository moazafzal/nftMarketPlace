import * as fs from 'fs'
import { readFile } from 'fs/promises'
// import i from '../../public/assets/images/avatars/avatar_1.jpg'
export default async(req, res)=> {
    
    const a = await fs.fchmodSync('avatar_1.jpg')
    console.log(a)
    res.status(200).json({ name: 'John Doe' })
  }