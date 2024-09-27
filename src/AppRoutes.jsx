import React from "react";
import { Routes, Route } from 'react-router-dom';
import MainAlbum from './pages/albums/MainAlbumPage';
import AlbumDetailsPage from "./pages/albums/AlbumDetailsPage";
import MainTracks from './pages/tracks/MainTracksPage';
import GenresPage from "./pages/genres/GenresPage";
import GenreTracks from "./components/GenreTracks";
import SearchPage from "./pages/search/SearchPage";
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import SignOut from './pages/auth/SignOut';
import AdminDashboard from "./pages/admin/AdminDashboard";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./ProtectedAppRoutes";
import AdminProtectedRoute from "./AdminProtectedRoute";
import FavoritesPage from "./pages/favorites/FavoritesPage";
import RecentlyPlayedPage from "./pages/RecentlyPlayed/RecentlyPlayedPage";

import ManageAlbums from "./pages/admin/ManageAlbums";
import ManageTracks from "./pages/admin/ManageTracks";
import ManageGenres from "./pages/admin/ManageGenres";
import ManageArtists from "./pages/admin/ManageArtists";
import NotFound from './components/NotFound';

const AppRoutes = ({ onPlay }) => {
    return (
        <Routes>
            <Route path="/" element={<Homepage onPlay={onPlay} />} />
            <Route path="/dreamstreamer/albums" element={<MainAlbum />} />
            <Route path="/dreamstreamer/albums/:albumId" element={<AlbumDetailsPage onPlay={onPlay} />} />
            <Route path="/dreamstreamer/tracks" element={<MainTracks onPlay={onPlay} />} />
            <Route path="/dreamstreamer/genres" element={<GenresPage />} />
            <Route path="/dreamstreamer/genres/:genreId" element={<GenreTracks onPlay={onPlay} />} />
            <Route path="/dreamstreamer/search" element={<SearchPage onPlay={onPlay} />} />
            <Route
                path="/dreamstreamer/favorites"
                element={<ProtectedRoute element={FavoritesPage} onPlay={onPlay} />}
            />
            <Route
                path="/dreamstreamer/recently-played"
                element={<ProtectedRoute element={RecentlyPlayedPage} onPlay={onPlay} />}
            />
            <Route path="/dreamstreamer/signup" element={<SignUp />} />
            <Route path="/dreamstreamer/signin" element={<SignIn />} />
            <Route path="/dreamstreamer/signout" element={<SignOut />} />

            {/* Admin Routes */}
            <Route
                path="/dreamstreamer/admin"
                element={<AdminProtectedRoute element={AdminDashboard} />}
            />
            <Route
                path="/dreamstreamer/admin/manage-albums"
                element={<AdminProtectedRoute element={ManageAlbums} />}
            />
            <Route
                path="/dreamstreamer/admin/manage-tracks"
                element={<AdminProtectedRoute element={ManageTracks} />}
            />
            <Route
                path="/dreamstreamer/admin/manage-genres"
                element={<AdminProtectedRoute element={ManageGenres} />}
            />
            <Route
                path="/dreamstreamer/admin/manage-artists"
                element={<AdminProtectedRoute element={ManageArtists} />}
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
