import React from 'react';

interface SwitchKeyModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const SwitchKeyModal: React.FC<SwitchKeyModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Switch API Key</h2>
        <p className="text-gray-400 mb-6">
          For your security, API keys are managed through Google AI Studio. You must use the official key selector to choose a different API key.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Open Key Selector
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Pasting keys directly into the app is disabled for security. You can add any key to your AI Studio account and select it from the list.
        </p>
      </div>
    </div>
  );
};