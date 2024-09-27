import React from 'react';
import { Link } from 'react-router-dom';

const Album = ({ album }) => {
  return (
    <Link to={`/dreamstreamer/albums/${album.id}`}>
      <div className="transform hover:scale-105 transition-transform duration-300 pt-2">
        {album.artwork_url ? (
          <img
            src={album.artwork_url}
            alt={`${album.title} artwork`}
            className="max-md:w-full w-48 h-48 rounded-lg object-cover"
          />
        ) : (
          <div className="bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">No Image Available</span>
          </div>
        )}
        <div className="pt-2">
          <h3 className="text-white text-lg font-semibold truncate">{album.title}</h3>
          <p className="text-gray-400 text-sm mt-1 truncate">{album.artist_names}</p>
        </div>
      </div>
    </Link>
  );
};

export default Album;
