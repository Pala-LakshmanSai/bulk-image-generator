import React from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-4 text-white">Enter Your Prompts</h2>
      <p className="text-gray-400 mb-4 text-sm">Enter one prompt per line. The more descriptive, the better!</p>
      <textarea
        className="w-full h-64 p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none text-gray-200"
        placeholder="A majestic lion overlooking the savanna at sunset&#10;A futuristic cityscape with flying cars&#10;A cozy cabin in a snowy forest..."
        value={value}
        onChange={onChange}
        disabled={isLoading}
        aria-label="Prompt input area"
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || value.trim().length === 0}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
        aria-live="polite"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Generating...
          </>
        ) : (
          'Generate Images'
        )}
      </button>
    </div>
  );
};
