import React from 'react';
import { ImageResult } from '../types';
import { ImageCard } from './ImageCard';

interface ImageGridProps {
  results: ImageResult[];
}

export const ImageGrid: React.FC<ImageGridProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800/50 rounded-lg p-8 border-2 border-dashed border-gray-700">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-300">Your generated images will appear here</h3>
          <p className="text-gray-500 mt-2">Enter some prompts and click "Generate Images" to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map((result) => (
        <ImageCard key={result.id} result={result} />
      ))}
    </div>
  );
};