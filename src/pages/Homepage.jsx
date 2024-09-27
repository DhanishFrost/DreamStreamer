import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './auth/AuthProvidor';
import { fetchPopularAlbums, fetchPopularArtists, fetchPopularTracks, fetchFavorites, addFavorite, removeFavorite, recordTrackPlay } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import getJWTToken from '../api/getJWTToken';
import ArtistPopup from '../components/ArtistPopup';

const Homepage = ({ onPlay }) => {
    const { userName } = useAuth();
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [artists, setArtists] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedArtistId, setSelectedArtistId] = useState(null);
    const [showArtistPopup, setShowArtistPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const albumContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [albumsData, tracksData, artistsData, fetchedFavorites] = await Promise.all([
                    fetchPopularAlbums(),
                    fetchPopularTracks(),
                    fetchPopularArtists(),
                    fetchFavorites()
                ]);
                setAlbums(albumsData || []);
                setTracks(tracksData || []);
                setArtists(artistsData || []);
                setFavorites(fetchedFavorites || []);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const slider = albumContainerRef.current;

        if (!slider) return; // Exit if the ref is not set

        const handleMouseDown = (e) => {
            setIsDragging(true);
            setStartX(e.pageX - slider.offsetLeft);
            setScrollLeft(slider.scrollLeft);
        };

        const handleMouseLeave = () => {
            setIsDragging(false);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Adjust the multiplier for scroll speed
            slider.scrollLeft = scrollLeft - walk;
        };

        slider.addEventListener('mousedown', handleMouseDown);
        slider.addEventListener('mouseleave', handleMouseLeave);
        slider.addEventListener('mouseup', handleMouseUp);
        slider.addEventListener('mousemove', handleMouseMove);

        // Cleanup event listeners on unmount
        return () => {
            if (slider) {
                slider.removeEventListener('mousedown', handleMouseDown);
                slider.removeEventListener('mouseleave', handleMouseLeave);
                slider.removeEventListener('mouseup', handleMouseUp);
                slider.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [isDragging, startX, scrollLeft, albumContainerRef.current]);

    const isFavorite = (trackId) => {
        return favorites.some(fav => fav.id === trackId);
    };

    const toggleFavorite = async (track) => {
        try {
            const token = await getJWTToken();
            if (!token) {
                navigate('/dreamstreamer/signin');
                return;
            }

            if (isFavorite(track.id)) {
                await removeFavorite(track.id);
                setFavorites(favorites.filter(fav => fav.id !== track.id));
            } else {
                await addFavorite(track.id);
                setFavorites([...favorites, track]);
            }
        } catch (error) {
            console.error('Error updating favorite:', error);
        }
    };

    const handlePlay = async (track) => {
        onPlay(track.song_url, {
            title: track.title,
            artist: track.artist_names,
            image: track.image_url,
        });

        try {
            const token = await getJWTToken();
            if (!token) {
                navigate('/dreamstreamer/signin');
                return;
            }

            await recordTrackPlay(track.id);
        } catch (error) {
            console.error('Error recording track play:', error);
        }
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading popular content: {error.message}</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            <header className="p-6">
                <h1 className="text-4xl font-bold">
                    {userName ? `Hello, ${userName}` : 'Welcome to DreamStreamer'}
                </h1>
            </header>
            <main className="flex-1 p-6 space-y-12">
                <section>
                    <h2 className="text-3xl font-semibold mb-4">Trending Hits</h2>
                    <div
                        ref={albumContainerRef}
                        className="flex space-x-6 overflow-x-scroll overflow-y-hidden p-2 snap-x snap-mandatory scroll-smooth scrollbar-hide cursor-grab active:cursor-grabbing"
                    >
                        {albums.map(album => (
                            <Link key={album.id} to={`/dreamstreamer/albums/${album.id}`}>
                                <div className="relative min-w-[400px] transform hover:scale-105 transition-transform duration-300 snap-center">
                                    {album.artwork_url ? (
                                        <div className="relative w-full h-64 rounded-lg shadow-lg overflow-hidden">
                                            <img
                                                src={album.artwork_url}
                                                alt={`${album.title} artwork`}
                                                className="w-full h-full object-cover opacity-50"
                                            />
                                            <div className="absolute inset-0 p-4 flex justify-between items-end">
                                                <p className="text-white text-xl mr-4 font-semibold truncate"
                                                    style={{
                                                        writingMode: 'vertical-rl',
                                                        position: 'absolute',
                                                        top: '8%',
                                                        right: '0',
                                                    }}>
                                                    {album.artist_name}
                                                </p>
                                                <div className="w-full flex flex-col justify-end">
                                                    <h3 className="text-white text-3xl font-semibold truncate">{album.title}</h3>
                                                    <h3 className="text-gray-300 text-md mt-1 truncate">{album.monthly_listeners} Listeners</h3>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-700 flex items-center justify-center w-full h-64 rounded-lg">
                                            <span className="text-gray-400">No Image Available</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
                <div className="md:flex">
                    <section className="md:w-1/2 pr-4 bg-[#111111] rounded-xl mr-4 p-6 overflow-auto">
                        <h2 className="text-3xl font-semibold mb-4">Popular Tracks</h2>
                        <table className="w-full mt-5">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-700">
                                    <th className="px-4 py-3 text-left">Title & Artist</th>
                                    <th className="px-4 py-3 text-left">Duration</th>
                                    <th className="px-4 py-3 text-left">Play</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tracks.map(track => {
                                    const artistNames = track.artist_names ? track.artist_names.split(', ').map(name => name.trim()) : [];
                                    const artistIds = track.artist_ids ? track.artist_ids.split(',').map(id => id.trim()) : [];

                                    return (
                                        <tr key={track.id} className="text-gray-300 hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                                            <td className="px-4 py-3 flex items-center">
                                                {track.image_url && (
                                                    <img
                                                        src={track.image_url}
                                                        alt={`${track.title} artwork`}
                                                        className="w-16 h-16 object-cover rounded-lg shadow-lg mr-4"
                                                    />
                                                )}
                                                <div>
                                                    <h2 className="text-lg font-semibold text-white truncate max-md:w-36">{track.title}</h2>
                                                    <p className="mt-1 truncate max-md:w-36">
                                                        {artistNames.length > 0 ? (
                                                            artistNames.map((artistName, index) => (
                                                                <span key={index}>
                                                                    <span
                                                                        className="cursor-pointer text-gray-400 hover:text-white hover:underline"
                                                                        onClick={() => handleArtistClick(artistIds[index])}
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
                                            <td className="px-4 py-3">{track.duration}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center space-x-5">
                                                    <div
                                                        className={`text-2xl cursor-pointer transition-transform transform hover:scale-110 ${isFavorite(track.id) ? 'text-red-500' : 'text-gray-600 hover:text-gray-500'}`}
                                                        onClick={() => toggleFavorite(track)}
                                                    >
                                                        <i className={`${isFavorite(track.id) ? 'fas fa-heart' : 'far fa-heart'}`}></i>
                                                    </div>
                                                    <button
                                                        className="text-white hover:text-white hover:opacity-75 p-2 rounded-lg transition-transform transform hover:scale-105 flex items-center"
                                                        onClick={() => handlePlay(track)}
                                                    >
                                                        <i className="fas fa-play"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>
                    <section className="md:w-1/2 max-md:mt-4 bg-[#111111] rounded-xl pl-4">
                        <div className="p-6">
                            <h2 className="text-3xl font-semibold mb-4">Top Artists</h2>
                            <div className="grid grid-cols-2 gap-4 overflow-y-auto">
                                {artists.map(artist => (
                                    <div
                                        key={artist.id}
                                        className="p-6 rounded-lg shadow-lg cursor-pointer"
                                        onClick={() => handleArtistClick(artist.id)}
                                    >
                                        <img
                                            src={artist.artist_image_url}
                                            alt={artist.name}
                                            className="mt-4 mb-6 w-32 h-32 rounded-full mx-auto object-cover"
                                        />
                                        <h2 className="text-xl font-semibold text-white text-center">{artist.name}</h2>
                                        <h3 className="text-sm text-gray-400 text-center">{artist.monthly_listeners} Listeners</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            {showArtistPopup && selectedArtistId && (
                <ArtistPopup artistId={selectedArtistId} onClose={closeArtistPopup} />
            )}
        </div>
    );
}

export default Homepage;
