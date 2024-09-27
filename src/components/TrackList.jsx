import React, { useState, useEffect } from 'react';
import { fetchFavorites } from '../api';
import Track from './Track';
import getJWTToken from '../api/getJWTToken';
import ArtistPopup from './ArtistPopup';

const TrackList = ({ tracks, onPlay }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [showArtistPopup, setShowArtistPopup] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const token = await getJWTToken();
        
        if (!token) {
          return;
        }
        
        const fetchedFavorites = await fetchFavorites();
        setFavorites(fetchedFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  const isFavorite = (trackId) => {
    return favorites.some(fav => fav.id === trackId);
  };

  const handleArtistClick = (artistId) => {
    if (selectedArtistId === artistId && showArtistPopup) {
      setShowArtistPopup(false);
      setSelectedArtistId(null);
      return;
    }

    if (showArtistPopup) {
      setShowArtistPopup(false);
      setTimeout(() => {
        setSelectedArtistId(artistId);
        setShowArtistPopup(true);
      }, 300); 
    } else {
      setSelectedArtistId(artistId);
      setShowArtistPopup(true);
    }
  };

  const closeArtistPopup = () => {
    setShowArtistPopup(false);
    setSelectedArtistId(null);
  };

  return (
    <>
      <table className="w-full mt-5">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="px-4 py-3 text-left">Title & Artist</th>
            <th className="px-4 py-3 text-left">Album</th>
            <th className="px-4 py-3 text-left">Duration</th>
            <th className="px-4 py-3 text-left">Play</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map(track => (
            <Track
              key={`${track.id}-${favorites.length}`} // Add favorites.length to the key to force re-render when favorites change
              track={track}
              onPlay={onPlay}
              initialFavoriteStatus={isFavorite(track.id)}
              onArtistClick={handleArtistClick}
            />
          ))}
        </tbody>
      </table>
      {showArtistPopup && selectedArtistId && (
        <ArtistPopup artistId={selectedArtistId} onClose={closeArtistPopup} />
      )}
    </>
  );
};

export default TrackList;
