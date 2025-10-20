
import React, { useState, useCallback, useEffect } from 'react';
import { ImageResult, ImageStatus } from './types';
import { generateImageFromPrompt } from './services/geminiService';
import { PromptInput } from './components/PromptInput';
import { ImageGrid } from './components/ImageGrid';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ApiKeySelector } from './components/ApiKeySelector';
import { SwitchKeyModal } from './components/SwitchKeyModal';

// This is a global declaration for the aistudio object.
// FIX: Define a named interface for aistudio and make it optional to resolve type conflicts.
// FIX: Moved the AIStudio interface definition inside the `declare global` block to resolve a TypeScript type conflict.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

const formatDuration = (parts: string[]): string => {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  const last = parts.pop()!;
  return `${parts.join(', ')} and ${last}`;
};

const parseQuotaError = (errorMessage: string): string | null => {
  const now = new Date();
  let resetTime: Date | null = null;
  const lowerCaseError = errorMessage.toLowerCase();

  if (lowerCaseError.includes('per minute')) {
    resetTime = new Date(now.getTime());
    resetTime.setMinutes(now.getMinutes() + 1, 0, 0);
  } else if (lowerCaseError.includes('per hour')) {
    resetTime = new Date(now.getTime());
    resetTime.setHours(now.getHours() + 1, 0, 0, 0);
  } else if (lowerCaseError.includes('per day')) {
    resetTime = new Date();
    resetTime.setUTCHours(24, 0, 0, 0); // Next day midnight UTC
  }

  if (!resetTime) {
    return null;
  }

  const diffSeconds = Math.max(0, Math.ceil((resetTime.getTime() - now.getTime()) / 1000));

  if (diffSeconds === 0) {
    return "Please try again in a few moments.";
  }

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
  
  if (parts.length === 0) {
    return "Please try again in a moment.";
  }

  return `Please try again in ${formatDuration(parts)}.`;
};


const App: React.FC = () => {
  const [prompts, setPrompts] = useState<string>(
    () => localStorage.getItem('bulk-image-generator-prompts') || ''
  );
  const [imageResults, setImageResults] = useState<ImageResult[]>(() => {
    const savedResults = localStorage.getItem('bulk-image-generator-results');
    if (savedResults) {
      try {
        const parsed = JSON.parse(savedResults);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse image results from localStorage", e);
        return [];
      }
    }
    return [];
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isKeySelected, setIsKeySelected] = useState<boolean>(false);
  const [isSwitchKeyModalOpen, setIsSwitchKeyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    localStorage.setItem('bulk-image-generator-prompts', prompts);
  }, [prompts]);

  useEffect(() => {
    localStorage.setItem('bulk-image-generator-results', JSON.stringify(imageResults));
  }, [imageResults]);
  
  const handleSelectKey = useCallback(async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setIsKeySelected(true); // Assume success to avoid race condition
    }
  }, []);

  const handleConfirmSwitchKey = useCallback(() => {
    handleSelectKey();
    setIsSwitchKeyModalOpen(false);
  }, [handleSelectKey]);

  const handleGenerate = useCallback(async () => {
    const promptList = prompts.split('\n').map(p => p.trim()).filter(p => p.length > 0);
    if (promptList.length === 0 || !isKeySelected) {
      return;
    }

    setIsGenerating(true);
    // Set initial loading state for all prompts
    const initialResults: ImageResult[] = promptList.map((prompt, index) => ({
      id: `${Date.now()}-${index}`,
      prompt,
      imageUrl: null,
      status: ImageStatus.LOADING,
    }));
    setImageResults(initialResults);

    // Process prompts sequentially to ensure stability
    const finalResults = [...initialResults];
    for (let i = 0; i < promptList.length; i++) {
        try {
            const imageData = await generateImageFromPrompt(promptList[i]);
            finalResults[i] = {
                ...finalResults[i],
                status: ImageStatus.SUCCESS,
                imageUrl: `data:${imageData.mimeType};base64,${imageData.data}`,
            };
        } catch (error) {
            const errorObj = error as any;
            const errorMessage = errorObj?.error?.message || (error as Error).message || 'An unknown error occurred';

            const isInvalidKeyError = errorMessage.includes("Requested entity was not found.");
            const isQuotaError = errorObj?.error?.status === 'RESOURCE_EXHAUSTED' || errorMessage.toLowerCase().includes("quota exceeded");

            if (isInvalidKeyError || isQuotaError) {
              let userFriendlyError: string;
              let forceKeyReselection = false;

              if (isQuotaError) {
                const waitMessage = parseQuotaError(errorMessage);
                if (waitMessage) {
                  userFriendlyError = `API quota exceeded. ${waitMessage} You can also switch to a different API key.`;
                } else {
                  userFriendlyError = "API quota exceeded. Please select a new key to continue.";
                  forceKeyReselection = true;
                }
              } else { // isInvalidKeyError
                userFriendlyError = "API Key is invalid. Please select a valid key and try again.";
                forceKeyReselection = true;
              }

              // Mark current and all subsequent prompts as errored
              for (let j = i; j < promptList.length; j++) {
                finalResults[j] = {
                  ...finalResults[j],
                  status: ImageStatus.ERROR,
                  error: userFriendlyError,
                };
              }
              
              setImageResults([...finalResults]);
              if (forceKeyReselection) {
                setIsKeySelected(false);
              }
              setIsGenerating(false);
              return; // Stop the generation process
            } else {
                 finalResults[i] = {
                    ...finalResults[i],
                    status: ImageStatus.ERROR,
                    error: errorMessage,
                };
            }
        }
        // Update state after each generation to show progress
        setImageResults([...finalResults]);
    }

    setIsGenerating(false);
  }, [prompts, isKeySelected]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      {!isKeySelected && <ApiKeySelector onSelectKey={handleSelectKey} />}
      {isSwitchKeyModalOpen && (
        <SwitchKeyModal
          onClose={() => setIsSwitchKeyModalOpen(false)}
          onConfirm={handleConfirmSwitchKey}
        />
      )}
      <Header onOpenSwitchKeyModal={() => setIsSwitchKeyModalOpen(true)} />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 flex flex-col">
          <div className="sticky top-8">
             <PromptInput
              value={prompts}
              onChange={(e) => setPrompts(e.target.value)}
              onSubmit={handleGenerate}
              isLoading={isGenerating}
            />
          </div>
        </div>
        <div className="lg:w-2/3">
          <ImageGrid results={imageResults} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
