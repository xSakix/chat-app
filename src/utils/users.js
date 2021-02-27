const users = [];

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  //clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }

  //check for existing user
  const existingUser = users.find(
    (_user) => _user.room === room && _user.username === username
  );

  //validate Username
  if (existingUser) {
    return {
      error: "Username is in use",
    };
  }

  //store user
  const user = { id, username, room };
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((_user) => _user.id === id);
  if (index < 0) {
    return {
      error: "User not found",
    };
  }

  return users.splice(index, 1)[0];
};

const getUser = (id) => {
  const index = users.findIndex((_user) => _user.id === id);
  if (index < 0) {
    return undefined;
  }

  return users[index];
};

const getUsersInRoom = (room) => {
  if(!room){
      return;
  }
  room = room.trim().toLowerCase()
  return users.filter((_user) => _user.room === room);
};

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}