import React, { useState, useEffect } from 'react';
import { fetchPopularAlbums, fetchPopularTracks, fetchPopularArtists, fetchPopularGenres } from '../../api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminDashboard = () => {
    const [popularAlbums, setPopularAlbums] = useState([]);
    const [popularTracks, setPopularTracks] = useState([]);
    const [popularArtists, setPopularArtists] = useState([]);
    const [popularGenres, setPopularGenres] = useState([]);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const albums = await fetchPopularAlbums();
            const tracks = await fetchPopularTracks();
            const artists = await fetchPopularArtists();
            const genres = await fetchPopularGenres();
            setPopularAlbums(albums);
            setPopularTracks(tracks);
            setPopularArtists(artists);
            setPopularGenres(genres);
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    };

    // Function to create a dataset for charts
    const createDataset = (label, data, color) => ({
        label,
        data,
        fill: false,
        backgroundColor: color,
        borderColor: color,
    });

    const engagementOverTimeData = {
        labels: popularTracks.map(track => track.title),
        datasets: [
            createDataset('User Engagement Over Time', popularTracks.map(track => track.play_count), 'rgba(75, 192, 192, 1)'),
        ],
    };

    const engagementOverTimeOptions = {
        scales: {
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)',
                },

            },
            y: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)',
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                },
            },
        },
    };


    // Data for top tracks by engagement (Pie chart)
    const topTracksByEngagementData = {
        labels: popularTracks.map(track => track.title),
        datasets: [
            {
                label: 'Top Tracks by Engagement',
                data: popularTracks.map(track => track.play_count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const topTracksByEngagementOptions = {
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                },
            },
        },
    };

    return (
        <div className="p-6 bg-black min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-6">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                <div className="bg-[#111111] p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">User Engagement Over Time</h2>
                    <Line data={engagementOverTimeData} options={engagementOverTimeOptions} />
                </div>

                <div className="bg-[#111111] p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Top Tracks by Engagement</h2>
                    <Pie data={topTracksByEngagementData} options={topTracksByEngagementOptions} />
                </div>

                <div className="pr-4 bg-[#111111] rounded-xl mr-4 p-6 overflow-hidden">
                    <h2 className="text-3xl text-white font-semibold mb-4">Popular Albums</h2>
                    <div className="overflow-y-auto max-h-96">
                        <table className="w-full mt-5">
                            <thead className="bg-gray-800 text-gray-400">
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">Album & Artist</th>
                                    <th className="px-4 py-3 text-left">Play Count</th>
                                    <th className="px-4 py-3 text-left">Monthly Listeners</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popularAlbums.map((album, index) => (
                                    <tr key={album.id} className="text-gray-300 hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 flex items-center">
                                            {album.artwork_url && (
                                                <img
                                                    src={album.artwork_url}
                                                    alt={`${album.title} artwork`}
                                                    className="w-16 h-16 object-cover rounded-lg shadow-lg mr-4"
                                                />
                                            )}
                                            <div>
                                                <h2 className="text-lg font-semibold text-white truncate max-md:w-36 w-36">{album.title}</h2>
                                                <p className="mt-1 text-gray-400 truncate max-md:w-36 w-36">
                                                    {album.artist_name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{album.play_count} plays</td>
                                        <td className="px-4 py-3">{album.monthly_listeners} Listeners</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pr-4 bg-[#111111] rounded-xl mr-4 p-6 overflow-auto">
                    <h2 className="text-3xl text-white font-semibold mb-4">Popular Tracks</h2>
                    <div className="overflow-y-auto max-h-96">
                        <table className="w-full mt-5">
                            <thead className="bg-gray-800 text-gray-400">
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">Title & Artist</th>
                                    <th className="px-4 py-3 text-left">Play Count</th>
                                    <th className="px-4 py-3 text-left">Monthly Listeners</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popularTracks.map((track, index) => {
                                    const artistNames = track.artist_names ? track.artist_names.split(', ').map(name => name.trim()) : [];

                                    return (
                                        <tr key={track.id} className="text-gray-300 hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3 flex items-center">
                                                {track.image_url && (
                                                    <img
                                                        src={track.image_url}
                                                        alt={`${track.title} artwork`}
                                                        className="w-16 h-16 object-cover rounded-lg shadow-lg mr-4"
                                                    />
                                                )}
                                                <div>
                                                    <h2 className="text-lg font-semibold text-white truncate max-md:w-36 w-36">{track.title}</h2>
                                                    <p className="mt-1 truncate max-md:w-36 w-36">
                                                        {artistNames.length > 0 ? (
                                                            artistNames.map((artistName, index) => (
                                                                <span key={index}>
                                                                    <span
                                                                        className="cursor-pointer text-gray-400 hover:text-white hover:underline"
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
                                            <td className="px-4 py-3">{track.play_count} plays</td>
                                            <td className="px-4 py-3">{track.monthly_listeners} Listeners</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pr-4 bg-[#111111] rounded-xl mr-4 p-6 overflow-auto">
                    <h2 className="text-3xl text-white font-semibold mb-4">Top Artists</h2>
                    <div className="overflow-y-auto max-h-96">
                        <table className="w-full mt-5">
                            <thead className="bg-gray-800 text-gray-400">
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">Artist</th>
                                    <th className="px-4 py-3 text-left">Play Count</th>
                                    <th className="px-4 py-3 text-left">Monthly Listeners</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popularArtists.map((artist, index) => (
                                    <tr key={artist.id} className="text-gray-300 hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 flex items-center">
                                            {artist.artist_image_url && (
                                                <img
                                                    src={artist.artist_image_url}
                                                    alt={`${artist.name} artwork`}
                                                    className="w-16 h-16 object-cover rounded-lg shadow-lg mr-4"
                                                />
                                            )}
                                            <div>
                                                <h2 className="text-lg font-semibold text-white truncate max-md:w-36 w-36">{artist.name}</h2>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{artist.play_count} plays</td>
                                        <td className="px-4 py-3">{artist.monthly_listeners} Listeners</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pr-4 bg-[#111111] rounded-xl mr-4 p-6 overflow-auto">
                    <h2 className="text-3xl text-white font-semibold mb-4">Top Genres</h2>
                    <div className="overflow-y-auto max-h-96">
                        <table className="w-full mt-5">
                            <thead className="bg-gray-800 text-gray-400">
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">Genre</th>
                                    <th className="px-4 py-3 text-left">Play Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popularGenres.map((genre, index) => (
                                    <tr key={genre.id} className="text-gray-300 hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 flex items-center">
                                            {genre.image_url && (
                                                <img
                                                    src={genre.image_url}
                                                    alt={`${genre.name} artwork`}
                                                    className="w-16 h-16 object-cover rounded-lg shadow-lg mr-4"
                                                />
                                            )}
                                            <div>
                                                <h2 className="text-lg font-semibold text-white truncate max-md:w-36 w-36">{genre.name}</h2>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{genre.play_count} plays</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
