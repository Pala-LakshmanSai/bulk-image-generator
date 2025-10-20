import React from 'react';
import { ImageResult, ImageStatus } from '../types';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { ErrorIcon } from './icons/ErrorIcon';

interface ImageCardProps {
  result: ImageResult;
}

export const ImageCard: React.FC<ImageCardProps> = ({ result }) => {
  const renderContent = () => {
    switch (result.status) {
      case ImageStatus.LOADING:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <LoadingSpinner />
            <p className="mt-4 text-sm text-gray-400">Generating...</p>
          </div>
        );
      case ImageStatus.SUCCESS:
        return (
          <img
            src={result.imageUrl!}
            alt={result.prompt}
            className="w-full h-full object-cover"
          />
        );
      case ImageStatus.ERROR:
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <ErrorIcon />
            <p className="mt-2 text-sm font-semibold text-red-400">Generation Failed</p>
            <p className="mt-1 text-xs text-gray-400 max-w-full break-words">{result.error}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden aspect-video flex flex-col">
      <div className="flex-grow flex items-center justify-center bg-gray-900">
        {renderContent()}
      </div>
      <div className="p-3 bg-gray-900/80">
        <p className="text-xs text-gray-300 truncate" title={result.prompt}>
          {result.prompt}
        </p>
      </div>
    </div>
  );
};
