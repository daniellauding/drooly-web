import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card } from "./ui/card";

interface Story {
  id: string;
  name: string;
  avatar: string;
  stories: { id: string; image: string; caption: string }[];
}

interface StoryViewerProps {
  stories: Story[];
  initialUserIndex: number;
  onClose: () => void;
}

export function StoryViewer({ stories, initialUserIndex, onClose }: StoryViewerProps) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentUser = stories[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentUserIndex, currentStoryIndex]);

  const handleNext = () => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
    setProgress(0);
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      setCurrentStoryIndex(stories[currentUserIndex - 1].stories.length - 1);
    }
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <Card className="relative w-full max-w-lg aspect-[9/16] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="flex gap-1 mb-4">
            {currentUser.stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                {idx === currentStoryIndex && (
                  <div 
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {idx < currentStoryIndex && (
                  <div className="h-full bg-white w-full" />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
            <span className="text-white font-medium">{currentUser.name}</span>
          </div>
        </div>
        
        <img 
          src={currentStory.image} 
          alt={currentStory.caption}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white">{currentStory.caption}</p>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:opacity-80"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white p-2 hover:opacity-80"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white p-2 hover:opacity-80"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </Card>
    </div>
  );
}