
import fs from 'fs';
import path from 'path';
import User from '../models/authdata.js';


export const updateUserPoints = async (req, res) => {
    try {
        const { userid, points } = req.body;
        console.log(userid)

        const user = await User.findOne({ userid });
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found of' });
        // }

        const folderPath = path.join(__dirname, '../data');
        const filePath = path.join(folderPath, `${user}.json`);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const data = { userid, points };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        

        user.points = points;
        await user.save();

        res.status(200).json({ message: 'User points updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

