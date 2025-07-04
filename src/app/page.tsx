"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { ComponentType } from "react";
import { PlayIcon, PauseIcon, StopIcon, BackwardIcon, ForwardIcon } from '@heroicons/react/24/solid';
import type { WaveSurferComponentProps } from "../components/WaveSurferComponent";

const WaveSurferComponent = dynamic(() =>
  import("../components/WaveSurferComponent") as Promise<{ default: ComponentType<WaveSurferComponentProps> }>
, { ssr: false });

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [repeatCount, setRepeatCount] = useState(3);
  const [abMarkers, setAbMarkers] = useState<{ a: number; b: number }>({ a: 0, b: 0 });
  const [isLooping, setIsLooping] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [centerOnAB, setCenterOnAB] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setAudioUrl(url); // For now, use the same URL for both video and audio
      setFileName(file.name);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background p-0 sm:p-2">
      <Card className="w-full max-w-md sm:max-w-2xl p-2 sm:p-4 flex flex-col gap-4 shadow-lg mt-0">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">Audio/Video Learning Editor</h1>
        {/* Choose File Button */}
        <label htmlFor="file-upload" className="w-full flex justify-center mb-2">
          <Button asChild className="w-full sm:w-auto">
            <span>
              Choose File
            </span>
          </Button>
          <input
            id="file-upload"
            type="file"
            accept="video/*,audio/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {fileName && (
          <div className="text-xs text-muted-foreground truncate w-full text-center mb-2">
            Selected file: {fileName}
          </div>
        )}
        {/* Video Section */}
        <div className="w-full flex items-center justify-center bg-muted rounded-lg aspect-video overflow-hidden max-h-48 sm:max-h-56">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
              <span className="text-lg">No video loaded</span>
              <span className="text-xs">Upload a video or audio file</span>
            </div>
          )}
        </div>
        {/* Waveform Section */}
        <div className="w-full min-h-32 flex flex-col items-center justify-center gap-2">
          {/* Zoom Slider */}
          <div className="flex items-center gap-2 w-full mb-1">
            <span className="text-xs">Zoom:</span>
            <Slider
              min={1}
              max={10}
              value={[zoom]}
              onValueChange={([val]) => setZoom(val)}
              className="w-32"
            />
            <span className="text-xs font-semibold text-primary">{zoom}x</span>
          </div>
          {audioUrl ? (
            <WaveSurferComponent
              audioUrl={audioUrl}
              abMarkers={abMarkers}
              setAbMarkers={(markers: { a: number; b: number }) => setAbMarkers(markers)}
              videoRef={videoRef}
              isLooping={isLooping}
              repeatCount={repeatCount}
              setIsLooping={setIsLooping}
              draggableMarkers
              scrollable
              zoom={zoom}
              onDuration={(d: number) => setDuration(d)}
              centerOnAB={centerOnAB}
              onCenterHandled={() => setCenterOnAB(false)}
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center bg-muted rounded text-muted-foreground">
              <span className="text-sm">Waveform will appear here</span>
            </div>
          )}
          {/* Playback Controls */}
          <div className="flex flex-row flex-wrap gap-2 justify-center items-center mt-2 w-full">
            {/* Marker Controls - Set A and Set B */}
            <button
              className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              onClick={() => setAbMarkers({ ...abMarkers, a: videoRef.current?.currentTime || 0 })}
            >
              Set A ({abMarkers.a.toFixed(1)}s)
            </button>
            <button
              className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              onClick={() => {
                setAbMarkers({ ...abMarkers, b: videoRef.current?.currentTime || 0 });
                setIsLooping(true);
                setZoom(8); // Zoom in
                setCenterOnAB(true); // Center A/B
              }}
            >
              Set B & Play ({abMarkers.b.toFixed(1)}s)
            </button>
            {/* Main Controls */}
            <Button size="sm" variant="outline" onClick={() => { if (videoRef.current) videoRef.current.currentTime = 0; }} disabled={!audioUrl} aria-label="Go to Start">
              <span className="tooltip" data-tooltip="Start">
                <BackwardIcon className="w-5 h-5" />
              </span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => { if (videoRef.current) videoRef.current.play(); }} disabled={!audioUrl} aria-label="Play">
              <span className="tooltip" data-tooltip="Play">
                <PlayIcon className="w-5 h-5" />
              </span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => { if (videoRef.current) videoRef.current.pause(); }} disabled={!audioUrl} aria-label="Pause">
              <span className="tooltip" data-tooltip="Pause">
                <PauseIcon className="w-5 h-5" />
              </span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }} disabled={!audioUrl} aria-label="Stop">
              <span className="tooltip" data-tooltip="Stop">
                <StopIcon className="w-5 h-5" />
              </span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => { if (videoRef.current && duration) videoRef.current.currentTime = duration; }} disabled={!audioUrl} aria-label="Go to End">
              <span className="tooltip" data-tooltip="End">
                <ForwardIcon className="w-5 h-5" />
              </span>
            </Button>
            <Button size="sm" variant={isLooping ? "default" : "outline"} className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsLooping((v) => !v)} disabled={!audioUrl} aria-label="Play A-B Loop">
              {isLooping ? "Stop A-B Loop" : "Play A-B Loop"}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setAbMarkers({ a: 0, b: duration })} disabled={!audioUrl} aria-label="Clear A/B Markers">
              Clear A/B
            </Button>
          </div>
        </div>
        {/* Controls Section */}
        <div className="flex flex-col gap-4 w-full items-center mt-2">
          <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm">Repeat:</span>
              <Slider
                min={1}
                max={10}
                value={[repeatCount]}
                onValueChange={([val]) => setRepeatCount(val)}
                className="w-24"
              />
              <span className="text-sm font-semibold text-primary">{repeatCount}x</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
