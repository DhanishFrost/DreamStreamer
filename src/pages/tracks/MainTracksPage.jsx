import React, { useEffect, useState } from 'react';
import { fetchTracks } from '../../api';
import TrackList from '../../components/TrackList';

const MainTracks = ({ onPlay }) => {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const result = await fetchTracks();
        setTracks(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-white mb-4">All Tracks</h2>
      <TrackList tracks={tracks} onPlay={onPlay} />
    </div>
  );
};

export default MainTracks;
