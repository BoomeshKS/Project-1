import Login from '../models/Login.js';

export const storeLoginInfo = async (req, res) => {
  const { userid,username, browser, os, device, ip } = req.body;
  try {

    const existingUser = await Login.findOne({ userid })

    if ( existingUser ) {
        return res.status(200).json({ message: 'User Already in database'});
    }


    const newLogin = new Login({ userid,username, browser, os, device, ip, timestamp: new Date() });
    await newLogin.save();
    res.status(200).send('Login information stored successfully');
  } catch (error) {
    res.status(500).send('Error storing login information');
  }
};

export const getAllLoginHistory = async (req, res) => {
  try {
    const loginHistory = await Login.find({}).sort({ timestamp: -1 }).select('username browser os timestamp');
    res.status(200).json(loginHistory);
  } catch (error) {
    res.status(500).send('Error fetching all login history');
  }
};

export const updateLoginHistory = async (req, res) => {
  const { userid } = req.params;
  const { username } = req.body;
  try {


    const updatedLogin = await Login.updateMany(
      { userid },
      { $set: { username, timestamp: new Date() 
      } }
    );
    if (updatedLogin.nModified === 0) {
      return res.status(404).send('No login history found for the given user ID');
    }
    res.status(200).send('Login history updated successfully');
  } catch (error) {
    res.status(500).send('Error updating login history');
  }
};