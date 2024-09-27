import React, { useState, useEffect } from 'react';
import { fetchTracks, createTrack, editTrack, deleteTrack, fetchGenres, fetchArtists, fetchAlbums } from '../../api';
import Select from 'react-select';
import FilterComponent from '../../components/FilterComponent';

const ManageTracks = () => {
    const [tracks, setTracks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [currentTrack, setCurrentTrack] = useState({ id: '', title: '', genreId: '', duration: '', artistIds: [], albumId: '', imageFile: null, songFile: null });
    const [deleteTrackData, setDeleteTrackData] = useState({ id: '', title: '', imageUrl: '', songUrl: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedArtist, setSelectedArtist] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadTracks();
        loadGenres();
        loadArtists();
        loadAlbums();
    }, []);

    useEffect(() => {
        loadFilteredTracks();
    }, [selectedGenre, selectedArtist, searchTerm]);

    const loadTracks = async () => {
        try {
            const fetchedTracks = await fetchTracks();
            setTracks(fetchedTracks);
        } catch (error) {
            setError('Failed to load tracks');
        }
    };

    const loadFilteredTracks = async () => {
        try {
            const filteredTracks = await fetchTracks({
                genreId: selectedGenre,
                artistId: selectedArtist,
                trackTitle: searchTerm,
            });
            setTracks(filteredTracks);
        } catch (error) {
            setError('Failed to load tracks');
        }
    };

    const loadGenres = async () => {
        try {
            const fetchedGenres = await fetchGenres();
            setGenres(fetchedGenres);
        } catch (error) {
            setError('Failed to load genres');
        }
    };

    const loadArtists = async () => {
        try {
            const fetchedArtists = await fetchArtists();
            setArtists(fetchedArtists);
        } catch (error) {
            setError('Failed to load artists');
        }
    };

    const loadAlbums = async () => {
        try {
            const fetchedAlbums = await fetchAlbums();
            setAlbums(fetchedAlbums);
        } catch (error) {
            setError('Failed to load albums');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file instanceof File) {
            setCurrentTrack(prev => ({ ...prev, imageFile: file }));
        } else {
            setError('Selected file is not valid');
            setTimeout(() => setError(''), 6000);
        }
    };

    const handleSongChange = (e) => {
        const file = e.target.files[0];
        if (file instanceof File) {
            setCurrentTrack(prev => ({ ...prev, songFile: file }));
        } else {
            setError('Selected file is not valid');
            setTimeout(() => setError(''), 6000);
        }
    };

    const handleSaveTrack = async () => {
        setIsLoading(true);
        try {
            const { id, title, genreId, duration, artistIds, albumId, imageFile, songFile } = currentTrack;
            if (!title || !genreId || (!isEditing && !songFile)) {
                setError('Title, genre, and song file are required.');
                setTimeout(() => setError(''), 6000);
                setIsLoading(false);
                return;
            }

            if (isEditing) {
                await editTrack(id, title, genreId, duration, artistIds, albumId, imageFile, songFile);
                setSuccessMessage('Track updated successfully!');
            } else {
                await createTrack(title, genreId, duration, artistIds, albumId, imageFile, songFile);
                setSuccessMessage('Track added successfully!');
            }

            const updatedTracks = await fetchTracks();
            setTracks(updatedTracks);
            setShowPopup(false);
            setCurrentTrack({ id: '', title: '', genreId: '', duration: '', artistIds: [], albumId: '', imageFile: null, songFile: null });
            setTimeout(() => setSuccessMessage(''), 6000);
        } catch (error) {
            setError(isEditing ? 'Failed to update track' : 'Failed to create track');
            setTimeout(() => setError(''), 6000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTrack = async () => {
        setIsLoading(true);
        try {
            const { id, imageUrl, songUrl } = deleteTrackData;
            await deleteTrack(id, imageUrl, songUrl);
            const updatedTracks = await fetchTracks();
            setTracks(updatedTracks);
            setShowDeletePopup(false);
            setDeleteTrackData({ id: '', title: '', imageUrl: '', songUrl: '' });
            setSuccessMessage('Track deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 6000);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to delete track');
            setTimeout(() => setError(''), 6000);
            setShowDeletePopup(false);
        } finally {
            setIsLoading(false);
        }
    };

    const openPopup = (track = null) => {
        if (track) {
            setCurrentTrack({
                id: track.id,
                title: track.title,
                genreId: track.genre_id,
                duration: track.duration,
                artistIds: track.artist_ids.split(',').map(id => parseInt(id)),
                albumId: track.album_id,
                imageFile: null,
                songFile: null
            });
            setIsEditing(true);
        } else {
            setCurrentTrack({ id: '', title: '', genreId: '', duration: '', artistIds: [], albumId: '', imageFile: null, songFile: null });
            setIsEditing(false);
        }
        setShowPopup(true);
    };

    const openDeletePopup = (track) => {
        setDeleteTrackData({ id: track.id, title: track.title, imageUrl: track.image_url, songUrl: track.song_url });
        setShowDeletePopup(true);
    };

    const artistOptions = artists.map(artist => ({
        value: artist.id,
        label: artist.name
    }));

    return (
        <div className='p-6'>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold text-white">Manage Tracks</h1>
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => openPopup()}
                >
                    Create Track
                </button>
            </div>

            <FilterComponent
                genres={genres}
                artists={artists}
                selectedGenre={selectedGenre}
                selectedArtist={selectedArtist}
                onGenreChange={setSelectedGenre}
                onArtistChange={setSelectedArtist}
                onSearchChange={setSearchTerm}
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
                            Genre
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Artist(s)
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Album
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Image
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Song
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-[#111111] divide-y divide-gray-400">
                    {tracks.map((track) => (
                        <tr key={track.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">
                                {track.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {track.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {track.genre_name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {track.artist_names || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {track.album_name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {track.duration || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {track.image_url && (
                                    <img
                                        src={track.image_url}
                                        alt={track.title}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {track.song_url && (
                                    <audio controls>
                                        <source src={track.song_url} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md font-medium">
                                <button
                                    className="text-indigo-600 hover:text-indigo-900"
                                    onClick={() => openPopup(track)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="ml-2 text-red-600 hover:text-red-900"
                                    onClick={() => openDeletePopup(track)}
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
                            {isEditing ? 'Edit Track' : 'Create Track'}
                        </h2>
                        {error && <div className="text-red-500">{error}</div>}
                        <input
                            type="text"
                            placeholder="Track Title"
                            value={currentTrack.title}
                            onChange={(e) => setCurrentTrack({ ...currentTrack, title: e.target.value })}
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        />
                        <select
                            value={currentTrack.genreId}
                            onChange={(e) => setCurrentTrack({ ...currentTrack, genreId: e.target.value })}
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        >
                            <option value="">Select Genre</option>
                            {genres.map(genre => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                        <Select
                            isMulti
                            value={artistOptions.filter(option => currentTrack.artistIds.includes(option.value))}
                            onChange={(selectedOptions) => setCurrentTrack({
                                ...currentTrack,
                                artistIds: selectedOptions.map(option => option.value)
                            })}
                            options={artistOptions}
                            className="w-full text-black mb-4"
                            classNamePrefix="select Artists"
                            placeholder="Select Artist(s)"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: 'black',
                                    color: 'white',
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: 'black',
                                    color: 'white',
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isFocused ? 'gray' : 'black',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'gray',
                                    },
                                }),
                                multiValue: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#333',
                                }),
                                multiValueLabel: (provided) => ({
                                    ...provided,
                                    color: 'white',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: 'white',
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    color: 'white',
                                }),
                                dropdownIndicator: (provided) => ({
                                    ...provided,
                                    color: 'white',
                                }),
                            }}
                        />

                        <select
                            value={currentTrack.albumId}
                            onChange={(e) => setCurrentTrack({ ...currentTrack, albumId: e.target.value })}
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        >
                            <option value="">Select Album</option>
                            {albums.map(album => (
                                <option key={album.id} value={album.id}>
                                    {album.title}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Duration (HH:MM:SS)"
                            value={currentTrack.duration}
                            onChange={(e) => setCurrentTrack({ ...currentTrack, duration: e.target.value })}
                            pattern="^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$"
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                            title="Please enter time in HH:MM:SS format"
                        />
                        <p className='text-white'>Upload Image</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        />
                        <p className='text-white'>Upload Song</p>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleSongChange}
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
                                onClick={handleSaveTrack}
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
                        <h2 className="text-white text-2xl font-semibold mb-4">Delete Track</h2>
                        <p className="text-white mb-4">Are you sure you want to delete the track "{deleteTrackData.title}"?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={() => setShowDeletePopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                                onClick={handleDeleteTrack}
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

export default ManageTracks;
