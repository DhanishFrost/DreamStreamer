import React, { useState, useEffect } from 'react';
import { fetchFavorites } from '../../api';
import TrackList from '../../components/TrackList';

const FavoritesPage = ({ onPlay }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const favoriteTracks = await fetchFavorites();
                setFavorites(favoriteTracks);
            } catch (err) {
                setError('Failed to load favorites');
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!favorites.length) {
        return <div>No favorite tracks found.</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-semibold text-white mb-4">Your Favorite Tracks</h2>
            <TrackList tracks={favorites} onPlay={onPlay} favoriteTracks={favorites} />
        </div>
    );
};

export default FavoritesPage;
