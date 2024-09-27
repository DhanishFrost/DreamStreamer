import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TrackList from './TrackList';
import { fetchGenreTracks } from '../api';

const GenreTracks = ({ onPlay }) => {
  const { genreId } = useParams();
  const [tracks, setTracks] = useState([]);
  const [genreName, setGenreName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const fetchedGenreTracks = await fetchGenreTracks(genreId);
        
        if (fetchedGenreTracks.length > 0) {
          setGenreName(fetchedGenreTracks[0].genre_name);
        }
        
        setTracks(fetchedGenreTracks);
      } catch (error) {
        console.error('Error loading genre tracks:', error);
        setError('Failed to load genre tracks');
      }
    };

    loadGenres();
  }, [genreId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!tracks.length) {
    return <div>No tracks found for this genre.</div>;
  }

  return (
    <div className='p-6'>
      <h1 className="text-3xl font-semibold text-white mb-4">{genreName}</h1>
      <TrackList tracks={tracks} onPlay={onPlay} />
    </div>
  );
};

export default GenreTracks;
