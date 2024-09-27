import React, { useState, useEffect } from 'react';
import { fetchAlbumDetails } from '../api';
import TrackList from './TrackList';
import ArtistPopup from './ArtistPopup';

const AlbumDetails = ({ albumId, showTracks = true, onPlay }) => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [showArtistPopup, setShowArtistPopup] = useState(false);


  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const albumData = await fetchAlbumDetails(albumId);
        setAlbum(albumData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

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

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error loading album details: {error.message}</div>;
  }

  const artistNames = album.artist_names || "Unknown Artist";
  const artistIds = album.artist_ids ? album.artist_ids.split(',').map(id => id.trim()) : [];
  const releaseYear = album.release_year || "Unknown Year";

  return (
    <div>
      <div className="px-6 pt-6 rounded-lg mx-auto">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-1/3">
            <img
              src={album.artwork_url}
              alt={album.title}
              className="rounded-lg shadow-lg mb-6 md:mb-0 md:w-full"
            />
          </div>
          <div className="md:w-2/3 md:pl-8 font-semibold">
            <h2 className="text-6xl font-bold text-white mb-4">{album.title}</h2>
            <p className="text-lg text-gray-400 mb-6">
              {artistNames.split(', ').map((artistName, index) => (
                <span key={index}>
                  <span
                    className="cursor-pointer text-gray-400 hover:text-white hover:underline"
                    onClick={() => handleArtistClick(artistIds[index])}
                  >
                    {artistName}
                  </span>
                  {index < artistNames.split(', ').length - 1 && ', '}
                </span>
              ))}
            </p>
            <p className="text-gray-400">Published in: {releaseYear}</p>
            <div className='flex'>
              <p className="text-gray-400">{album.track_count} songs </p>
              <span className="mx-2 text-gray-300">•</span>
              <p className="text-gray-400">{album.total_duration} min</p>
            </div>
          </div>
        </div>
      </div>
      {showTracks && (
        <div className="p-6 mt-6 rounded-lg mx-auto">
          <h3 className="text-2xl font-semibold text-white mb-4">Tracks</h3>
          {album.tracks && album.tracks.length > 0 ? (
            <TrackList tracks={album.tracks} onPlay={onPlay} />
          ) : (
            <p className="text-sm text-gray-400">No tracks available for this album.</p>
          )}
          {showArtistPopup && selectedArtistId && (
            <ArtistPopup artistId={selectedArtistId} onClose={closeArtistPopup} />
          )}
        </div>
      )}
    </div>
  );
};

export default AlbumDetails;
