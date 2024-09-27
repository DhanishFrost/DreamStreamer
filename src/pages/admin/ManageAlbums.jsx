import React, { useState, useEffect } from 'react';
import { fetchAlbums, createAlbum, editAlbum, deleteAlbum, fetchGenres, fetchArtists } from '../../api';
import FilterComponent from '../../components/FilterComponent';

const ManageAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedArtist, setSelectedArtist] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [currentAlbum, setCurrentAlbum] = useState({ id: '', title: '', releaseYear: '', artistId: '', imageFile: null });
    const [deleteAlbumData, setDeleteAlbumData] = useState({ id: '', title: '', artworkUrl: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [fetchedAlbums, fetchedGenres, fetchedArtists] = await Promise.all([
                    fetchAlbums(),
                    fetchGenres(),
                    fetchArtists()
                ]);
                setAlbums(fetchedAlbums);
                setGenres(fetchedGenres);
                setArtists(fetchedArtists);
            } catch (err) {
                setError('Failed to load data');
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        const debouncedSearch = setTimeout(() => {
            loadFilteredAlbums();
        }, 500);

        return () => {
            clearTimeout(debouncedSearch);
        };
    }, [searchTerm, selectedGenre, selectedArtist]);

    const loadFilteredAlbums = async () => {
        try {
            const result = await fetchAlbums({
                genreId: selectedGenre,
                artistId: selectedArtist,
                albumTitle: searchTerm,
                trackTitle: searchTerm,
            });
            setAlbums(result);
        } catch (err) {
            setError('Failed to load filtered albums');
        }
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file instanceof File) {
            setCurrentAlbum(prev => ({ ...prev, imageFile: file }));
        } else {
            setError('Selected file is not valid');
            setTimeout(() => setError(''), 6000);
        }
    };

    const handleSaveAlbum = async () => {
        setIsLoading(true);
        try {
            const { id, title, releaseYear, artistId, imageFile } = currentAlbum;
            if (!title) {
                setError('Title is required.');
                setTimeout(() => setError(''), 6000);
                setIsLoading(false);
                return;
            }

            if (isEditing) {
                await editAlbum(id, title, releaseYear, artistId, imageFile);
                setSuccessMessage('Album updated successfully!');
            } else {
                await createAlbum(title, releaseYear, artistId, imageFile);
                setSuccessMessage('Album added successfully!');
            }

            const updatedAlbums = await fetchAlbums();
            setAlbums(updatedAlbums);
            setShowPopup(false);
            setCurrentAlbum({ id: '', title: '', releaseYear: '', artistId: '', imageFile: null });
            setTimeout(() => setSuccessMessage(''), 6000);
        } catch (error) {
            setError(isEditing ? 'Failed to update album' : 'Failed to create album');
            setTimeout(() => setError(''), 6000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAlbum = async () => {
        setIsLoading(true);
        try {
            const { id, artworkUrl } = deleteAlbumData;
            await deleteAlbum(id, artworkUrl);
            const updatedAlbums = await fetchAlbums();
            setAlbums(updatedAlbums);
            setShowDeletePopup(false);
            setDeleteAlbumData({ id: '', title: '', artworkUrl: '' });
            setSuccessMessage('Album deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 6000);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to delete album');
            setTimeout(() => setError(''), 6000);
            setShowDeletePopup(false);
        } finally {
            setIsLoading(false);
        }
    };

    const openPopup = (album = null) => {
        if (album) {
            setCurrentAlbum({
                id: album.id,
                title: album.title,
                releaseYear: album.release_year,
                artistId: album.artist_ids,
                imageFile: null
            });
            setIsEditing(true);
        } else {
            setCurrentAlbum({ id: '', title: '', releaseYear: '', artistId: '', imageFile: null });
            setIsEditing(false);
        }
        setShowPopup(true);
    };

    const openDeletePopup = (album) => {
        setDeleteAlbumData({ id: album.id, title: album.title, artworkUrl: album.artwork_url });
        setShowDeletePopup(true);
    };

    return (
        <div className='p-6'>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold text-white">Manage Albums</h1>
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => openPopup()}
                >
                    Create Album
                </button>
            </div>

            <FilterComponent
                genres={genres}
                artists={artists}
                selectedGenre={selectedGenre}
                selectedArtist={selectedArtist}
                onGenreChange={setSelectedGenre}
                onArtistChange={setSelectedArtist}
                onSearchChange={handleSearchChange}
                searchTerm={searchTerm}
            />

            {error && <div className="text-red-500">{error}</div>}
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

            <table className="min-w-full divide-y divide-gray-400 overflow-x-auto">
                <thead className="bg-gray-900">
                    <tr>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Release Year
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Artist
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Artwork
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-[#111111] divide-y divide-gray-400">
                    {albums.map((album) => (
                        <tr key={album.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">
                                {album.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {album.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {album.release_year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {album.artist_names || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                    src={album.artwork_url}
                                    alt={album.title}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md font-medium">
                                <button
                                    className="text-indigo-600 hover:text-indigo-900"
                                    onClick={() => openPopup(album)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="ml-2 text-red-600 hover:text-red-900"
                                    onClick={() => openDeletePopup(album)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showPopup && (
                <div className="fixed inset-0 bg-[#111111] bg-opacity-75 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-md w-96">
                        <h2 className="text-white text-2xl font-semibold mb-4">
                            {isEditing ? 'Edit Album' : 'Create Album'}
                        </h2>
                        {error && <div className="text-red-500">{error}</div>}
                        <input
                            type="text"
                            placeholder="Album Title"
                            value={currentAlbum.title}
                            onChange={(e) => setCurrentAlbum({ ...currentAlbum, title: e.target.value })}
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Release Year"
                            value={currentAlbum.releaseYear}
                            onChange={(e) => setCurrentAlbum({ ...currentAlbum, releaseYear: e.target.value })}
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        />
                        <select
                            value={currentAlbum.artistId}
                            onChange={(e) => setCurrentAlbum({ ...currentAlbum, artistId: e.target.value })}
                            required
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        >
                            <option value="">Select Artist</option>
                            {artists.map(artist => (
                                <option key={artist.id} value={artist.id}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={() => setShowPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
                                onClick={handleSaveAlbum}
                                disabled={isLoading}
                            >
                                {isEditing ? 'Save' : 'Create'}
                                {isLoading && (
                                    <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent border-b-transparent rounded-full animate-spin"></div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeletePopup && (
                <div className="fixed inset-0 bg-[#111111] bg-opacity-75 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-md w-96">
                        <h2 className="text-white text-2xl font-semibold mb-4">Delete Album</h2>
                        <p className="text-white mb-4">Are you sure you want to delete the album "{deleteAlbumData.title}"?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={() => setShowDeletePopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                                onClick={handleDeleteAlbum}
                                disabled={isLoading}
                            >
                                Delete
                                {isLoading && (
                                    <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent border-b-transparent rounded-full animate-spin"></div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAlbums;
