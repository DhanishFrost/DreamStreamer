import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGenres } from '../../api';

const GenresPage = () => {
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const fetchedGenres = await fetchGenres();
                setGenres(fetchedGenres);
            } catch (error) {
                console.error('Error loading genres:', error);
                setError('Failed to load genres');
            }
        };

        loadGenres();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!genres.length) {
        return <div>No genres found.</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-semibold text-white mb-4">Music Genres</h2>
            <ul className="flex flex-wrap gap-4">
                {genres.map((genre) => (
                    <li
                        key={genre.id}
                        className="relative w-80 h-48 rounded-lg overflow-hidden shadow-lg text-white"
                    >
                        <Link to={`/dreamstreamer/genres/${genre.id}`} className="block w-full h-full">
                            <img
                                src={genre.image_url}
                                alt={genre.name}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black hover:bg-opacity-70 bg-opacity-60 flex items-center justify-center">
                                <span className="font-semibold text-white text-3xl">{genre.name}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GenresPage;
