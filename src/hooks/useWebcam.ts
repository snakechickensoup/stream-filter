import { useCallback, useEffect, useRef, useState } from 'react';
import { useDeviceType } from './useDeviceType';
import { useCanvasRenderer } from './useCanvasRenderer';
import type { FacingMode } from '../libs/types';

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const { isMobile } = useDeviceType();
  const isStreamingRef = useRef(false);

  const renderCanvas = useCanvasRenderer(videoRef);

  const startStream = useCallback(
    async (facing: FacingMode) => {
      if (isStreamingRef.current) return;
      isStreamingRef.current = true;

      try {
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: 320, ideal: isMobile ? 320 : 480, max: 1280 },
            height: { min: 240, ideal: isMobile ? 240 : 360, max: 720 },
            frameRate: { min: 10, ideal: isMobile ? 15 : 20, max: 30 },
            facingMode: facing
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const playVideo = async () => {
            await videoRef.current?.play().then(() => {
              setIsStreaming(false);
              setFacingMode(facing);
              isStreamingRef.current = false;
            });
          };

          if (videoRef.current.readyState >= 2) {
            await playVideo();
          } else {
            videoRef.current.addEventListener('loadeddata', playVideo, { once: true });
          }
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
        setIsStreaming(false);
        isStreamingRef.current = false;
      }
    },
    [isMobile]
  );

  const stopStream = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const flipCamera = useCallback(() => {
    const newFacingMode: FacingMode = facingMode === 'environment' ? 'user' : 'environment';
    startStream(newFacingMode);
  }, [facingMode, startStream]);

  useEffect(() => {
    if (!isStreaming && videoRef.current && !videoRef.current.srcObject) {
      startStream(facingMode);
    }
    return () => stopStream();
  }, [facingMode, isStreaming, startStream, stopStream]);

  return {
    videoRef,
    canvasRef: renderCanvas.canvasRef,

    // 스트림 상태
    isStreaming,
    facingMode,

    // 조작 함수들
    flipCamera,
    startStream,
    stopStream
  };
};
