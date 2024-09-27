import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import AppRoutes from './AppRoutes';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './pages/auth/AuthProvidor';
import AdminSidebar from './pages/admin/AdminSidebar';

function App() {
  const [playingTrack, setPlayingTrack] = useState(null);
  const [currentTrackInfo, setCurrentTrackInfo] = useState(null);
  const audioRef = useRef(null);
  const location = useLocation();

  const handlePlay = (trackUrl, trackInfo) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = trackUrl;
      audioRef.current.play();
    }
    setPlayingTrack(trackUrl);
    setCurrentTrackInfo(trackInfo);
  };

  const handleClosePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingTrack(null);
    setCurrentTrackInfo(null);
  };

  const isLoginOrSignup = location.pathname === '/dreamstreamer/signup' || location.pathname === '/dreamstreamer/signin';
  const isAdminRoute = location.pathname.startsWith('/dreamstreamer/admin');

  useEffect(() => {
    if (isLoginOrSignup && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isLoginOrSignup]);

  return (
    <AuthProvider>
      <div className="flex flex-col h-screen bg-black">
        {!isLoginOrSignup && isAdminRoute && <AdminSidebar />}
        {!isLoginOrSignup && !isAdminRoute && <Sidebar />}
        
        <div className={!isLoginOrSignup && (isAdminRoute || !isAdminRoute) ? "flex-1 md:ml-72 p-4 overflow-y-auto bg-black" : "bg-black"}>
          <AppRoutes onPlay={handlePlay} />
        </div>
        
        {!isLoginOrSignup && playingTrack && (
          <div className="bg-[#111111] fixed bottom-0 left-0 right-0 p-4 flex items-center">
            {currentTrackInfo?.image && (
              <img
                src={currentTrackInfo.image}
                alt="Track Artwork"
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />
            )}
            <div className="flex flex-col justify-between w-72 mr-4">
              <div className="text-white text-sm font-bold">{currentTrackInfo?.title}</div>
              <div className="text-gray-400 text-sm">{currentTrackInfo?.artist}</div>
            </div>

            <audio
              controls
              autoPlay
              className="w-full ml-4"
              ref={audioRef}
            >
              <source src={playingTrack} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button
              className="text-white text-2xl ml-4"
              onClick={handleClosePlayer}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
