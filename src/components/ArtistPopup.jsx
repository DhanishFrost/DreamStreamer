import React, { useState, useEffect } from 'react';
import { fetchArtistDetails } from '../api';

const ArtistPopup = ({ artistId, onClose }) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtistDetails = async () => {
      try {
        const artistDetails = await fetchArtistDetails(artistId);
        setArtist(artistDetails);
      } catch (err) {
        setError('Failed to load artist details');
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      loadArtistDetails();
    }
  }, [artistId]);

  if (!artistId || loading) return null;

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
        <div className="bg-[#111111] text-white shadow-lg p-6 rounded-lg">
          <p>{error}</p>
          <button
            onClick={onClose}
            className="mt-4 text-white text-lg focus:outline-none hover:text-gray-300 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-[#111111] text-white shadow-2xl p-6 rounded-lg w-full md:w-2/4 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="text-white text-2xl mb-4 focus:outline-none hover:text-gray-300 transition-colors duration-200"
        >
          ×
        </button>
        <div>
          <div className="relative">
            <img
              src={artist.artist_image_url}
              alt={artist.name}
              className="w-full h-64 rounded-t-lg object-cover"
            />
            <h3 className="font-semibold absolute top-0 left-0 tracking-wide bg-black bg-opacity-60 text-white p-3 rounded-tl-lg">
              About the artist
            </h3>
          </div>
          <div className="mt-6">
            <h2 className="text-4xl font-extrabold text-white mb-4">{artist.name}</h2>
            <div className="flex flex-col md:flex-row justify-between">
              <div className="md:w-1/3 space-y-2">
                <p className="text-lg text-gray-400 italic">Born: {artist.birth_date}</p>
                <div className="py-2">
                  <p className="text-2xl text-white font-bold">{artist.monthly_listeners.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Monthly Listeners</p>
                </div>
                <p className='text-lg pt-8 text-gray-400'><i className="fab fa-facebook-f text-2xl"></i><span className='mx-2'></span>Facebook</p>
                <p className='text-lg text-gray-400'><i className="fab fa-twitter text-2xl"></i><span className='mx-2'></span>Instagram</p>
                <p className='text-lg text-gray-400'><i className="fab fa-instagram text-2xl"><span className='mx-2'></span></i>Twitter</p>
              </div>
              <div className="md:w-2/3 mt-4 md:mt-0">
                <p className="text-base leading-relaxed text-gray-300 text-justify">{artist.biography}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPopup;
