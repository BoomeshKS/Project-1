
import UserData from '../models/authdata.js';

export const savePoints = async (req, res) => {
  const { userid, points, username } = req.body;

  try {
    const existingUser = await UserData.findOne({ userid });


    if (existingUser) {
      return res.status(200).json({ message: 'User already logged in', username: existingUser.username,points: existingUser.points });
    }

    const newUser = new UserData({
      userid,
      points,
      username
    });

    await newUser.save();
    res.status(200).json({ message: 'User data received and saved successfully', username: newUser.username });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ message: 'Error saving user data' });
  }
};

export const checkUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const existingUser = await UserData.findOne({ username });

    if (existingUser) {
      return res.status(200).json({ exists: true });
    }

    res.status(200).json({ exists: false });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ message: 'Error checking username' });
  }
};

export const saveUsername = async (req, res) => {
  const { userid, username } = req.body;

  try {
    const existingUser = await UserData.findOne({ userid });

    if (existingUser) {
      existingUser.username = username;
      await existingUser.save();
      return res.status(200).json({ message: 'Username updated successfully' });
    } else {
      const newUser = new UserData({
        userid,
        username,
      });
      await newUser.save();
      res.status(200).json({ message: 'Username saved successfully' });
    }
  } catch (error) {
    console.error('Error saving username:', error);
    res.status(500).json({ message: 'Error saving username' });
  }
};




export const increasePoints = async (req, res) => {
  const { userId, points } = req.body;

  try {
    const user = await UserData.findOne({ userid: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.points += points;
    await user.save();

    res.status(200).json({ message: 'Points increased successfully' });
  } catch (error) {
    console.error('Error increasing points:', error);
    res.status(500).json({ message: 'Error increasing points' });
  }
};
export const pointsIncrease = async (req, res) => {
  const { username, points } = req.body;

  try {
    const user = await UserData.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.points += points;
    await user.save();

    res.status(200).json({ message: 'Points increased successfully' });
  } catch (error) {
    console.error('Error increasing points:', error);
    res.status(500).json({ message: 'Error increasing points' });
  }
};



export const getPoints = async (req, res) => {
  const { username } = req.query;

  try {
      const user = await UserData.findOne({ username });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ points: user.points });
  } catch (error) {
      console.error('Error getting points:', error);
      res.status(500).json({ message: 'Error getting points' });
  }
};


export const decreasePoints = async (req, res) => {
  const { username, points } = req.body;

  try {
    const user = await UserData.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.points < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    user.points += points; 
    await user.save();

    res.status(200).json({ message: 'Points decreased successfully' });
  } catch (error) {
    console.error('Error decreasing points:', error);
    res.status(500).json({ message: 'Error decreasing points' });
  }
};