import React from 'react';

const FilterComponent = ({ 
  genres, 
  artists, 
  selectedGenre, 
  selectedArtist, 
  onGenreChange, 
  onArtistChange, 
  onSearchChange, 
  searchTerm,
  searchHeading = "Search by Album or Track",
  searchPlaceholder = "Search albums or tracks..."
}) => {
  return (
    <div className="md:flex mb-6">
      {genres && (
        <div className="mb-4 mr-6">
          <label className="text-white">Filter by Genre:</label>
          <select
            className="bg-gray-900 text-white p-2 rounded-lg w-full mt-1"
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {artists && (
        <div className="mb-4 mr-6">
          <label className="text-white">Filter by Artist:</label>
          <select
            className="bg-gray-900 text-white p-2 rounded-lg w-full mt-1"
            value={selectedArtist}
            onChange={(e) => onArtistChange(e.target.value)}
          >
            <option value="">All Artists</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="text-white">{searchHeading}</label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="bg-gray-900 text-white p-2 pl-10 rounded-lg w-full"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
