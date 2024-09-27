import React, { useState, useEffect } from 'react';
import { fetchArtists, createArtist, editArtist, deleteArtist } from '../../api';
import FilterComponent from '../../components/FilterComponent';

const ManageArtists = () => {
    const [artists, setArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [currentArtist, setCurrentArtist] = useState({ id: '', name: '', biography: '', birthDate: '', imageFile: null });
    const [deleteArtistData, setDeleteArtistData] = useState({ id: '', name: '', artistImageUrl: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadArtists = async () => {
            try {
                const fetchedArtists = await fetchArtists({ searchTerm });
                setArtists(fetchedArtists);
            } catch (error) {
                setError('Failed to load artists');
            }
        };

        loadArtists();
    }, [searchTerm]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file instanceof File) {
            setCurrentArtist(prev => ({ ...prev, imageFile: file }));
        } else {
            setError('Selected file is not valid');
            setTimeout(() => setError(''), 6000);
        }
    };

    const handleSaveArtist = async () => {
        setIsLoading(true);
        try {
            const { id, name, biography, birthDate, imageFile } = currentArtist;
            if (!name) {
                setError('Name is required.');
                setTimeout(() => setError(''), 6000);
                setIsLoading(false);
                return;
            }

            if (isEditing) {
                await editArtist(id, name, biography, birthDate, imageFile);
                setSuccessMessage('Artist updated successfully!');
            } else {
                if (!imageFile) {
                    setError('Image is required.');
                    setTimeout(() => setError(''), 6000);
                    setIsLoading(false);
                    return;
                }
                await createArtist(name, biography, birthDate, imageFile);
                setSuccessMessage('Artist added successfully!');
            }

            const updatedArtists = await fetchArtists();
            setArtists(updatedArtists);
            setShowPopup(false);
            setCurrentArtist({ id: '', name: '', biography: '', birthDate: '', imageFile: null });
            setTimeout(() => setSuccessMessage(''), 6000);
        } catch (error) {
            setError(isEditing ? 'Failed to update artist' : 'Failed to create artist');
            setTimeout(() => setError(''), 6000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteArtist = async () => {
        setIsLoading(true);
        try {
            const { id, artistImageUrl } = deleteArtistData;
            await deleteArtist(id, artistImageUrl);
            const updatedArtists = await fetchArtists();
            setArtists(updatedArtists);
            setShowDeletePopup(false);
            setDeleteArtistData({ id: '', name: '', artistImageUrl: '' });
            setSuccessMessage('Artist deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 6000);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to delete artist');
            setTimeout(() => setError(''), 6000);
            setShowDeletePopup(false);
        } finally {
            setIsLoading(false);
        }
    };

    const openPopup = (artist = null) => {
        if (artist) {
            setCurrentArtist({ id: artist.id, name: artist.name, biography: artist.biography, birthDate: artist.birth_date, imageFile: null });
            setIsEditing(true);
        } else {
            setCurrentArtist({ id: '', name: '', biography: '', birthDate: '', imageFile: null });
            setIsEditing(false);
        }
        setShowPopup(true);
    };

    const openDeletePopup = (artist) => {
        setDeleteArtistData({ id: artist.id, name: artist.name, artistImageUrl: artist.artist_image_url });
        setShowDeletePopup(true);
    };

    return (
        <div className='p-6'>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold text-white">Manage Artists</h1>
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => openPopup()}
                >
                    Create Artist
                </button>
            </div>

            <FilterComponent
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchHeading="Search for Artist"
                searchPlaceholder="Search by name and biography..." 
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
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Biography
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Birth Date
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Image
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-[#111111] divide-y divide-gray-400">
                    {artists.map((artist) => (
                        <tr key={artist.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">
                                {artist.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {artist.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                <div
                                    className="max-w-xs truncate"
                                    title={artist.biography}
                                >
                                    {artist.biography}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {new Date(artist.birth_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                    src={artist.artist_image_url}
                                    alt={artist.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md font-medium">
                                <button
                                    className="text-indigo-600 hover:text-indigo-900"
                                    onClick={() => openPopup(artist)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="ml-2 text-red-600 hover:text-red-900"
                                    onClick={() => openDeletePopup(artist)}
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
                            {isEditing ? 'Edit Artist' : 'Create Artist'}
                        </h2>
                        {error && <div className="text-red-500">{error}</div>}
                        <input
                            type="text"
                            placeholder="Artist Name"
                            value={currentArtist.name}
                            onChange={(e) => setCurrentArtist({ ...currentArtist, name: e.target.value })}
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        />
                        <textarea
                            placeholder="Biography"
                            value={currentArtist.biography}
                            onChange={(e) => setCurrentArtist({ ...currentArtist, biography: e.target.value })}
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        />
                        <input
                            type="date"
                            value={currentArtist.birthDate}
                            onChange={(e) => setCurrentArtist({ ...currentArtist, birthDate: e.target.value })}
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                        />
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
                                onClick={handleSaveArtist}
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
                        <h2 className="text-white text-2xl font-semibold mb-4">Delete Artist</h2>
                        <p className="text-white mb-4">Are you sure you want to delete the artist "{deleteArtistData.name}"?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={() => setShowDeletePopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                                onClick={handleDeleteArtist}
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

export default ManageArtists;
