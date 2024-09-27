import React from 'react';
import { useParams } from 'react-router-dom';
import AlbumDetails from '../../components/AlbumDetails';

const AlbumDetailsPage = ({ onPlay }) => {
  const { albumId } = useParams();

  return (
    <div className="p-6">
      <AlbumDetails albumId={albumId} showTracks={true} onPlay={onPlay} />
    </div>
  );
};

export default AlbumDetailsPage;
