import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [username, setUsername] = useState('');
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const navigate = useNavigate();
 const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const handleCreateRoom = () => {
if (!username.trim()) {
      alert('Please enter a username first!');
      return;
    } 
const newRoomId = generateRoomId();
  
    navigate(`/room/${newRoomId}`, { state: { username } });
  };

 const handleJoinRoom = () => {
    if (!username.trim() || !roomIdToJoin.trim()) {
      alert('Please enter both a username and a Room ID!');
      return;
    }
    navigate(`/room/${roomIdToJoin}`, { state: { username } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">YouTube Watch Party</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleCreateRoom}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
            >Create New Room
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Room Code"
              value={roomIdToJoin}
              onChange={(e) => setRoomIdToJoin(e.target.value)}
            />
            <button
              onClick={handleJoinRoom}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition font-medium"
            >Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;