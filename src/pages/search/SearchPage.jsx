import React, { useState, useEffect } from 'react';
import { fetchTracksBySearch } from '../../api';
import TrackList from '../../components/TrackList';
import { debounce } from 'lodash';

const SearchPage = ({ onPlay }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce the fetchTracks function
  const debouncedFetchTracks = debounce(async (term) => {
    if (term) {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchTracksBySearch(term);
        setTracks(result);
      } catch (error) {
        setError('Failed to fetch tracks');
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setTracks([]); // Clear the tracks when the search term is cleared
    }
  }, 300);

  useEffect(() => {
    debouncedFetchTracks(searchTerm);

    // Cleanup function to cancel any pending debounced calls when searchTerm changes
    return () => {
      debouncedFetchTracks.cancel();
    };
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black p-6">
      <input
        type="text"
        className="bg-gray-800 text-white p-2 rounded-lg w-full mb-6"
        placeholder="Search by track, artist, or album..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {!searchTerm && !loading && (
        <div className="text-gray-400 text-center mt-10">Search for a track, artist, or album...</div>
      )}
      {loading && <div className="text-white text-center mt-10">Loading...</div>}
      {error && <div className="text-red-500 text-center mt-10">{error}</div>}
      {tracks.length > 0 ? (
        <TrackList tracks={tracks} onPlay={onPlay} />
      ) : (
        searchTerm && !loading && <div className="text-gray-400 text-center mt-10">No tracks found.</div>
      )}
    </div>
  );
};

export default SearchPage;
