import React from 'react';

interface ApiKeySelectorProps {
  onSelectKey: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectKey }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Select API Key</h2>
        <p className="text-gray-400 mb-6">
          To generate images, please select your Google AI Studio API key using the secure dialog. For your protection, API keys cannot be pasted directly into the app.
        </p>
        <button
          onClick={onSelectKey}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
        >
          Select Your API Key
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Usage of the Gemini API is subject to billing. For more information, see the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            billing documentation
          </a>.
        </p>
      </div>
    </div>
  );
};