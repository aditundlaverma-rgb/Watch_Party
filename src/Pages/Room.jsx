import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; 
import YouTube from 'react-youtube';
import { io } from 'socket.io-client';

const socket = io('https://watch-party-server-xlz4.onrender.com');

const Room = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); 
  const username = location.state?.username || "Guest";
  
  const [videoId, setVideoId] = useState('jfKfPfyJRdk'); 
  const [participants, setParticipants] = useState([]);
  const [videoInput, setVideoInput] = useState('');

  const playerRef = useRef(null);
  const isReceivingSync = useRef(false);

  useEffect(() => {
    socket.emit('join_room', { roomId, username });

    socket.on('update_participants', (updatedParticipants) => setParticipants(updatedParticipants));
    socket.on('video_changed', (newVideoId) => setVideoId(newVideoId));

    socket.on('play', () => {
  if (playerRef.current) { isReceivingSync.current = true; playerRef.current.playVideo(); }
    });
    socket.on('pause', () => {
      if (playerRef.current) { isReceivingSync.current = true; playerRef.current.pauseVideo(); }
    });
    socket.on('seek', (time) => {
      if (playerRef.current) { isReceivingSync.current = true; playerRef.current.seekTo(time, true); }
    });

  
    socket.on('kicked', () => {
      alert("You have been removed from the room by the Host.");
      navigate('/'); 
    });

    return () => {
      socket.off('join_room');
      socket.off('update_participants');
      socket.off('video_changed');
      socket.off('play');
      socket.off('pause');
      socket.off('seek');
      socket.off('kicked');
    };
  }, [roomId, username, navigate]);

const myUser = participants.find(p => p.userId === socket.id);
const myRole = myUser ? myUser.role : 'Participant';
const canControl = myRole === 'Host' || myRole === 'Moderator';
const isHost = myRole === 'Host'; 

const handleReady = (event) => playerRef.current = event.target;

 const handlePlay = () => {
    if (isReceivingSync.current) { isReceivingSync.current = false; return; }
    if (canControl) socket.emit('play', { roomId });
  };

  const handlePause = () => {
    if (isReceivingSync.current) { isReceivingSync.current = false; return; }
    if (canControl) socket.emit('pause', { roomId });
  };

  const handleStateChange = (event) => {
    if (event.data === 3 && canControl && !isReceivingSync.current) {
      socket.emit('seek', { roomId, time: playerRef.current.getCurrentTime() });
    }
  };

const handleSyncVideo = () => {
    if (!videoInput) return;
    let nextVideoId = videoInput;
    if (videoInput.includes('v=')) nextVideoId = videoInput.split('v=')[1].substring(0, 11);
    else if (videoInput.includes('youtu.be/')) nextVideoId = videoInput.split('youtu.be/')[1].substring(0, 11);
    socket.emit('change_video', { roomId, videoId: nextVideoId });
    setVideoInput(''); 
  };
const handlePromote = (targetUserId) => {
    socket.emit('assign_role', { roomId, targetUserId, newRole: 'Moderator' });
  };
const handleKick = (targetUserId) => {
    socket.emit('remove_participant', { roomId, targetUserId });
  };

  const opts = { height: '450', width: '100%', playerVars: { autoplay: 1, controls: 1 } };

  return (
    <div className="flex h-screen bg-gray-100 p-4">
      <div className="flex-grow pr-4 flex flex-col">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Room Code: <span className="text-blue-600">{roomId}</span></h2>
          </div>
          
          <div className={`w-full bg-black rounded-md overflow-hidden flex justify-center ${!canControl ? 'pointer-events-none opacity-90' : ''}`}>
            <YouTube videoId={videoId} opts={opts} onReady={handleReady} onPlay={handlePlay} onPause={handlePause} onStateChange={handleStateChange} className="w-full max-w-4xl" />
          </div>
          {!canControl && <p className="text-center text-sm text-red-500 mt-2 font-medium">You are viewing in Watch-Only mode.</p>}
        </div>
        
        {canControl && (
          <div className="bg-white p-4 rounded-lg shadow-md">
             <h3 className="font-semibold text-gray-700 mb-2">Change Video (Host/Mod Only)</h3>
             <div className="flex gap-2">
               <input type="text" value={videoInput} onChange={(e) => setVideoInput(e.target.value)} placeholder="Paste a YouTube URL or Video ID..." className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
               <button onClick={handleSyncVideo} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sync Video</button>
             </div>
          </div>
        )}
      </div>

      <div className="w-80 bg-white p-4 rounded-lg shadow-md flex flex-col">
        <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">Participants ({participants.length})</h3>
        <ul className="flex-grow overflow-y-auto">
          {participants.map((user) => (
            <li key={user.userId} className="flex flex-col py-3 border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">
                  {user.username} {user.userId === socket.id && "(You)"}
                </span>
                <span className={`text-xs px-2 py-1 rounded font-semibold border ${
                  user.role === 'Host' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                  user.role === 'Moderator' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {user.role}
                </span>
              </div>
              
             
              {isHost && user.userId !== socket.id && (
                <div className="flex gap-2 justify-end mt-1">
                  {user.role === 'Participant' && (
                    <button 
                      onClick={() => handlePromote(user.userId)}
                      className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 px-2 py-1 rounded border border-purple-200 transition"
                    >
                      Promote to Mod
                    </button>
                  )}
                  <button 
                    onClick={() => handleKick(user.userId)}
                    className="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-2 py-1 rounded border border-red-200 transition"
                  >
                    Kick
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Room;