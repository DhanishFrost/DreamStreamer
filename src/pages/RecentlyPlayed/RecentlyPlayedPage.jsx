import React, { useState, useEffect } from 'react';
import { fetchRecentlyPlayed } from '../../api';
import TrackList from '../../components/TrackList';

const RecentlyPlayedPage = ({ onPlay }) => {
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRecentlyPlayed = async () => {
            try {
                const tracks = await fetchRecentlyPlayed();
                setRecentlyPlayed(tracks);
            } catch (err) {
                setError('Failed to load recently played tracks');
            } finally {
                setLoading(false);
            }
        };

        loadRecentlyPlayed();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-semibold text-white mb-4">Recently Played Tracks</h2>
            <TrackList tracks={recentlyPlayed} onPlay={onPlay} />
        </div>
    );
};

export default RecentlyPlayedPage;
