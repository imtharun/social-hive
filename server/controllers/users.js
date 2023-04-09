import User from "../models/User.js";

// Read

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((fId) => User.findById(fId))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
    return;
  } catch (error) {
    res.status(404).json({ message: error.message });
    return;
  }
};

// Update
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    console.log(id, friendId, "id, friendId");

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    console.log(user, friend, "user, friend");

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);

      friend.friends = friend.friends.filter((fofId) => fofId !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((fId) => User.findById(fId))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, location, occupation, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          location,
          occupation,
          picturePath,
        };
      }
    );

    res.status(200).json(formattedFriends);
    return;
  } catch (error) {
    res.status(404).json({ message: error.message });
    return;
  }
};
