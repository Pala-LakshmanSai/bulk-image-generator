import React from 'react';

export const Header: React.FC<{ onOpenSwitchKeyModal: () => void }> = ({ onOpenSwitchKeyModal }) => {
  return (
    <header className="py-6 px-4 md:px-8 text-center border-b border-gray-700 relative">
      <h1 className="text-4xl font-bold text-white tracking-tight">
        Bulk Image Generator
      </h1>
      <p className="text-lg text-gray-400 mt-2">
        Turn your ideas into images, one prompt at a time.
      </p>
      <button
        onClick={onOpenSwitchKeyModal}
        className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200"
        aria-label="Switch Google AI Studio API Key"
      >
        Switch Key
      </button>
    </header>
  );
};
