import Points from '../models/User.js';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const askQuestion = async(req,res) => {
    const { name, email, YourPoints, upvotePoints, totalVotes } = req.body;

    const points = new Points({
        name,
        email,
        YourPoints,
        upvotePoints,
        totalVotes,
    });

    try {
        const savedPoints = await points.save();

        const folderPath = path.join(__dirname, '../data');
        const fileName = `${name}-${Date.now()}.json`;
        const filePath = path.join(folderPath, fileName);
    
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
        }
    
        fs.writeFileSync(filePath, JSON.stringify({ name,email,YourPoints, upvotePoints, totalVotes }, null, 2));




        res.status(200).json(savedPoints);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save points', error });
    }
}