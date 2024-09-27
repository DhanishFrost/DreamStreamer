import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import SignOut from '../pages/auth/SignOut';
import { useAuth } from '../pages/auth/AuthProvidor';
import UserInfoPopup from "../pages/auth/UserInfoPopup";

function Sidebar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userName } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleUserProfileClick = () => {
    if (userName) {
      setShowPopup(true);
    } else {
      navigate('/dreamstreamer/signin');
    }
  };

  return (
    <div>
      <nav>
        <div className="container md:fixed md:top-0 md:bottom-0 md:w-64 md:p-5 md:ml-5 bg-black">
          <button
            onClick={toggleMobileMenu}
            className="text-white p-2 md:hidden"
            x-transition:enter="transition duration-300 ease-out transform"
            x-transition:enter-start="opacity-0 scale-90"
            x-transition:enter-end="opacity-100 scale-100"
            x-transition:leave="transition duration-200 ease-in transform"
            x-transition:leave-start="opacity-100 scale-100"
            x-transition:leave-end="opacity-0 scale-90"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>

          <ul className="max-md:hidden">
            <h2 className="text-2xl font-bold text-white mb-5">
              DreamStreamer
            </h2>
            <h3 className="text-lg font-semibold text-white mb-4 mt-14">
              Browse Music
            </h3>
            <li>
              <Link
                to="/"
                className="flex items-center py-1.5 px-3 my-3 rounded-lg transition-all diagonal-gradient text-gray-400 hover:text-white"
              >
                <i className="fas fa-home w-4 h-4 mr-5"></i>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dreamstreamer/albums"
                className="flex items-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-record-vinyl w-4 h-4 mr-5"></i>
                <span>Albums</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dreamstreamer/tracks"
                className="flex items-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-music w-4 h-4 mr-5"></i>
                <span>Tracks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dreamstreamer/genres"
                className="flex items-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-guitar w-4 h-4 mr-5"></i>
                <span>Genres</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dreamstreamer/search"
                className="flex items-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-search w-4 h-4 mr-5"></i>
                <span>Search</span>
              </Link>
            </li>
            <h3 className="text-lg font-semibold text-white mb-4 mt-8">
              Library
            </h3>
            <li>
              <Link
                to="/dreamstreamer/recently-played"
                className="flex items-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-history w-4 h-4 mr-5"></i>
                <span>Recently Played</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dreamstreamer/favorites"
                className="flex items-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-heart w-4 h-4 mr-5"></i>
                <span>Favorite Tracks</span>
              </Link>
            </li>
            <h3 className="text-lg font-semibold text-white mb-4 mt-8">
              Settings
            </h3>
            <li>
            <div className="flex items-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient">
              <i className="fas fa-user w-4 h-4 mr-5"></i>
              <button
                onClick={handleUserProfileClick}
              >
                User Profile
              </button>
            </div>
          </li>
            <li className="absolute bottom-0 w-full">
              <div className="flex pb-8">
                {userName ? (
                    <SignOut />
                ) : (
                    <>
                        <Link to="/dreamstreamer/signup">
                            <button className="text-lg text-white opacity-75 hover:opacity-100 font-semibold pr-8 py-2 transition duration-300">
                                Sign up
                            </button>
                        </Link>
                        <Link to="/dreamstreamer/signin">
                            <button className="text-lg text-white opacity-75 hover:opacity-100 font-semibold py-2 transition duration-300">
                                Log in
                            </button>
                        </Link>
                    </>
                )}
                </div>
            </li>
          </ul>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="bg-black md:hidden absolute top-16 left-0 right-0 z-50">
          <ul className="text-white text-center py-4">
            <h2 className="text-2xl font-bold text-white mb-5">
              DreamStreamer
            </h2>
            <h3 className="text-lg font-semibold text-white mb-4 mt-14">
              Browse Music
            </h3>
            <li>
              <Link
                to="/"
                className="flex items-center justify-center py-1.5 px-3 my-3 rounded-lg transition-all diagonal-gradient text-gray-400 hover:text-white"
              >
                <i className="fas fa-home w-4 h-4 mr-5"></i>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dreamstreamer/albums"
                className="flex items-center justify-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-record-vinyl w-4 h-4 mr-5"></i>
                <span>Albums</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dreamstreamer/tracks"
                className="flex items-center justify-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-music w-4 h-4 mr-5"></i>
                <span>Tracks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dreamstreamer/genres"
                className="flex items-center justify-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-guitar w-4 h-4 mr-5"></i>
                <span>Genres</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dreamstreamer/search"
                className="flex items-center justify-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-search w-4 h-4 mr-5"></i>
                <span>Search</span>
              </Link>
            </li>
            <h3 className="text-lg font-semibold text-white mb-4 mt-8">
              Library
            </h3>
            <li>
              <Link
                to="/dreamstreamer/recently-played"
                className="flex items-center justify-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-history w-4 h-4 mr-5"></i>
                <span>Recently Played</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dreamstreamer/favorites"
                className="flex items-center justify-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient"
              >
                <i className="fas fa-heart w-4 h-4 mr-5"></i>
                <span>Favorite Tracks</span>
              </Link>
            </li>
            <div className="flex items-center justify-center py-1.5 px-3 my-3 rounded-lg transition-all text-gray-400 hover:text-white diagonal-gradient">
              <i className="fas fa-user w-4 h-4 mr-5"></i>
              <button
                onClick={handleUserProfileClick}
              >
                User Profile
              </button>
            </div>
            <li className="mt-12 justify-center">
              <div className="pb-4">
                {userName ? (
                    <SignOut />
                ) : (
                    <>
                        <Link to="/dreamstreamer/signup">
                            <button className="text-lg text-white opacity-75 hover:opacity-100 font-semibold pr-8 py-2 transition duration-300">
                                Sign up
                            </button>
                        </Link>
                        <Link to="/dreamstreamer/signin">
                            <button className="text-lg text-white opacity-75 hover:opacity-100 font-semibold py-2 transition duration-300">
                                Log in
                            </button>
                        </Link>
                    </>
                )}
                </div>
            </li>
          </ul>
        </div>
      )}
      {showPopup && (
      <UserInfoPopup onClose={() => setShowPopup(false)} />
    )}
    </div>
  );
}

export default Sidebar;
