import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, deleteUser } from '../slices/authSlice'; // Adjust the import path

const ManageUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user', can_manage_tools: false, can_manage_testlines: false });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = () => {
    dispatch(addUser(newUser));
    setNewUser({ username: '', email: '', password: '', role: 'user', can_manage_tools: false, can_manage_testlines: false });
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
      <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
      <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
      <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
        <option value="user">User</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
      <label>
        <input type="checkbox" checked={newUser.can_manage_tools} onChange={(e) => setNewUser({ ...newUser, can_manage_tools: e.target.checked })} />
        Can Manage Tools
      </label>
      <label>
        <input type="checkbox" checked={newUser.can_manage_testlines} onChange={(e) => setNewUser({ ...newUser, can_manage_testlines: e.target.checked })} />
        Can Manage Test Lines
      </label>
      <button onClick={handleAddUser}>Add User</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
