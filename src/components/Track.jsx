import React, { useState } from 'react';
import { addFavorite, removeFavorite, recordTrackPlay } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import getJWTToken from '../api/getJWTToken';

const Track = ({ track, onPlay, initialFavoriteStatus, onArtistClick }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavoriteStatus);
  const navigate = useNavigate();

  const toggleFavorite = async () => {
    try {
      const token = await getJWTToken();
      if (token == null) {
        navigate('/dreamstreamer/signin');
        return;
      }

      if (isFavorite) {
        await removeFavorite(track.id);
      } else {
        await addFavorite(track.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handlePlay = async () => {
    onPlay(track.song_url, {
      title: track.title,
      artist: track.artist_names,
      image: track.image_url,
    });

    try {
      const token = await getJWTToken();
      if (token == null) {
        navigate('/dreamstreamer/signin');
        return;
      }

      await recordTrackPlay(track.id);
    } catch (error) {
      console.error('Error recording track play:', error);
    }
  };

  const artistNames = track.artist_names ? track.artist_names.split(', ').map(name => name.trim()) : [];
  const artistIds = track.artist_ids ? track.artist_ids.split(',').map(id => id.trim()) : [];

  return (
    <tr className="text-gray-300 hover:bg-white hover:bg-opacity-10 transition-all duration-300">
      <td className="px-4 py-3 flex items-center">
        {track.image_url && (
          <img
            src={track.image_url}
            alt={`${track.title} artwork`}
            className="w-16 h-16 object-cover rounded-lg shadow-lg mr-4"
          />
        )}
        <div>
          <h2 className="text-lg font-semibold text-white">{track.title}</h2>
          <p className="mt-1">
            {artistNames.length > 0 ? (
              artistNames.map((artistName, index) => (
                <span key={index}>
                  <span
                    className="cursor-pointer text-gray-400 hover:text-white hover:underline"
                    onClick={() => onArtistClick(artistIds[index])}
                  >
                    {artistName}
                  </span>
                  {index < artistNames.length - 1 && ', '}
                </span>
              ))
            ) : (
              <span className="text-gray-500">Unknown Artist</span>
            )}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <Link to={`/dreamstreamer/albums/${track.album_id}`} className="text-gray-400 hover:text-white hover:underline">
          {track.album_name}
        </Link>
      </td>
      <td className="px-4 py-3">{track.duration}</td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-5">
          <div
            className={`text-2xl cursor-pointer transition-transform transform hover:scale-110 ${isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-gray-500'}`}
            onClick={toggleFavorite}
          >
            <i className={`${isFavorite ? 'fas fa-heart' : 'far fa-heart'}`}></i>
          </div>
          <button
            className="text-white hover:text-white hover:opacity-75 p-2 rounded-lg transition-transform transform hover:scale-105 flex items-center"
            onClick={handlePlay}
          >
            <i className="fas fa-play"></i>
          </button>
        </div>
      </td>

    </tr>
  );
};

export default Track;