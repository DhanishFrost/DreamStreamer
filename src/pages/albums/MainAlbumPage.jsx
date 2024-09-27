import React, { useEffect, useState } from 'react';
import { fetchAlbums, fetchGenres, fetchArtists } from '../../api';
import Album from '../../components/Album';
import FilterComponent from '../../components/FilterComponent';

const MainAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Function to load filtered albums without showing a loading spinner
  const loadFilteredAlbums = async () => {
    try {
      const result = await fetchAlbums({
        genreId: selectedGenre,
        artistId: selectedArtist,
        albumTitle: searchTerm,
        trackTitle: searchTerm,
      });
      setAlbums(result);
    } catch (err) {
      setError(err.message);
    }
  };

  // Initial data load with loading spinner
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [fetchedAlbums, fetchedGenres, fetchedArtists] = await Promise.all([
          fetchAlbums(),
          fetchGenres(),
          fetchArtists()
        ]);
        setAlbums(fetchedAlbums);
        setGenres(fetchedGenres);
        setArtists(fetchedArtists);
      } catch (err) {
        setError(err.message);
      }
    };

    loadInitialData();
  }, []);

  // Effect to handle filtering with debounce without showing a loading spinner
  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      loadFilteredAlbums();
    }, 500); // Delay of 500ms

    // Cleanup function to clear the timeout if the component unmounts or searchTerm changes
    return () => {
      clearTimeout(debouncedSearch);
    };
  }, [searchTerm, selectedGenre, selectedArtist]);

  const handleSearchChange = (value) => {
    setSearchTerm(value); // Update searchTerm state directly
  };

  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="flex flex-col bg-black p-6">
      <h2 className="text-3xl font-semibold text-white mb-6">All Albums</h2>
      <FilterComponent
        genres={genres}
        artists={artists}
        selectedGenre={selectedGenre}
        selectedArtist={selectedArtist}
        onGenreChange={setSelectedGenre}
        onArtistChange={setSelectedArtist}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm} // Pass searchTerm to the component
      />
      {albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {albums.map((album) => (
            <Album key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center mt-10">No albums available.</div>
      )}
    </div>
  );
};

export default MainAlbum;
