import React, { useState, useEffect } from 'react';
import { fetchGenres, createGenre, editGenre, deleteGenre } from '../../api';
import FilterComponent from '../../components/FilterComponent';

const ManageGenres = () => {
    const [genres, setGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [currentGenre, setCurrentGenre] = useState({ id: '', name: '', imageFile: null });
    const [deleteGenreData, setDeleteGenreData] = useState({ id: '', name: '', imageUrl: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const fetchedGenres = await fetchGenres({ searchTerm });
                setGenres(fetchedGenres);
            } catch (error) {
                setError('Failed to load genres');
            }
        };

        loadGenres();
    }, [searchTerm]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file instanceof File) {
            setCurrentGenre(prev => ({ ...prev, imageFile: file }));
        } else {
            setError('Selected file is not valid');
            setTimeout(() => setError(''), 6000);
        }
    };

    const handleSaveGenre = async () => {
        setIsLoading(true);
        try {
            const { id, name, imageFile } = currentGenre;
            if (!name) {
                setError('Name is required.');
                setTimeout(() => setError(''), 6000);
                setIsLoading(false);
                return;
            }

            if (isEditing) {
                // Include imageFile only if a new image has been uploaded
                await editGenre(id, name, imageFile || undefined);
                setSuccessMessage('Genre updated successfully!');
            } else {
                if (!imageFile) {
                    setError('Image is required.');
                    setTimeout(() => setError(''), 6000);
                    setIsLoading(false);
                    return;
                }
                await createGenre(name, imageFile);
                setSuccessMessage('Genre added successfully!');
            }

            const updatedGenres = await fetchGenres();
            setGenres(updatedGenres);
            setShowPopup(false);
            setCurrentGenre({ id: '', name: '', imageFile: null });
            setTimeout(() => setSuccessMessage(''), 6000);
        } catch (error) {
            setError(isEditing ? 'Failed to update genre' : 'Failed to create genre');
            setTimeout(() => setError(''), 6000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteGenre = async () => {
        setIsLoading(true);
        try {
            const { id, imageUrl } = deleteGenreData;
            await deleteGenre(id, imageUrl);
            const updatedGenres = await fetchGenres();
            setGenres(updatedGenres);
            setShowDeletePopup(false);
            setDeleteGenreData({ id: '', name: '', imageUrl: '' });
            setSuccessMessage('Genre deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 6000);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to delete genre');
            setTimeout(() => setError(''), 6000);
            setShowDeletePopup(false);
        } finally {
            setIsLoading(false);
        }
    };

    const openPopup = (genre = null) => {
        if (genre) {
            setCurrentGenre({ id: genre.id, name: genre.name, imageFile: null });
            setIsEditing(true);
        } else {
            setCurrentGenre({ id: '', name: '', imageFile: null });
            setIsEditing(false);
        }
        setShowPopup(true);
    };

    const openDeletePopup = (genre) => {
        setDeleteGenreData({ id: genre.id, name: genre.name, imageUrl: genre.image_url });
        setShowDeletePopup(true);
    };

    return (
        <div className='p-6'>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold text-white">Manage Genres</h1>
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => openPopup()}
                >
                    Create Genre
                </button>
            </div>

            <FilterComponent
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchHeading="Search for Genre"
                searchPlaceholder="Search by genre name..."
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
                            Image
                        </th>
                        <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-[#111111] divide-y divide-gray-400">
                    {genres.map((genre) => (
                        <tr key={genre.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-white">
                                {genre.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md text-white">
                                {genre.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                    src={genre.image_url}
                                    alt={genre.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-md font-medium">
                                <button
                                    className="text-indigo-600 hover:text-indigo-900"
                                    onClick={() => openPopup(genre)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="ml-2 text-red-600 hover:text-red-900"
                                    onClick={() => openDeletePopup(genre)}
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
                            {isEditing ? 'Edit Genre' : 'Create Genre'}
                        </h2>
                        {error && <div className="text-red-500">{error}</div>}
                        <input
                            type="text"
                            placeholder="Genre Name"
                            value={currentGenre.name}
                            onChange={(e) => setCurrentGenre({ ...currentGenre, name: e.target.value })}
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
                                onClick={handleSaveGenre}
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
                        <h2 className="text-white text-2xl font-semibold mb-4">Delete Genre</h2>
                        <p className="text-white mb-4">Are you sure you want to delete the genre "{deleteGenreData.name}"?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={() => setShowDeletePopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                                onClick={handleDeleteGenre}
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

export default ManageGenres;
