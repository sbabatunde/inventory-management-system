// src/modules/documentation/components/shared/VideoTutorial.tsx

import React from "react";
import { useState } from "react";

interface VideoTutorialProps {
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  duration?: string;
}

const VideoTutorial: React.FC<VideoTutorialProps> = ({
  title,
  description,
  thumbnailUrl,
  videoUrl,
  duration,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="relative">
        {isPlaying && videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full aspect-video"
          />
        ) : (
          <button
            onClick={() => setIsPlaying(true)}
            className="w-full aspect-video bg-slate-900 relative group"
          >
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <i className="fas fa-video text-4xl text-slate-600" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-play text-white text-xl ml-1" />
              </div>
            </div>
            {duration && (
              <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                {duration}
              </span>
            )}
          </button>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default VideoTutorial;
