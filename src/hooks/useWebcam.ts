import { useCallback, useEffect, useRef, useState } from 'react';
import { useDeviceType } from './useDeviceType';
import { useCanvasRenderer } from './useCanvasRenderer';
import { saveCanvasImage } from '../libs/utils';
import type { FacingMode } from '../libs/types';

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isStreamingRef = useRef<boolean>(false);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [isCaptured, setIsCaptured] = useState<boolean>(false);
  const { isMobile } = useDeviceType();
  const { canvasRef, startRendering, stopRendering, drawCanvasWithEffects } =
    useCanvasRenderer(videoRef);

  const initializeStream = useCallback(
    (facing: FacingMode) => {
      return navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 320, ideal: isMobile ? 320 : 480, max: 1280 },
          height: { min: 240, ideal: isMobile ? 240 : 360, max: 720 },
          frameRate: { min: 10, ideal: isMobile ? 15 : 20, max: 30 },
          facingMode: facing
        }
      });
    },
    [isMobile]
  );

  const playVideo = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
    } catch (error) {
      console.error('Error playing video:', error);
      isStreamingRef.current = false;
    }
  }, []);

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

        const stream = await initializeStream(facing);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setFacingMode(facing);

          if (videoRef.current.readyState >= 2) {
            await playVideo();
          } else {
            videoRef.current.addEventListener('loadeddata', playVideo, { once: true });
          }
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
        isStreamingRef.current = false;
      } finally {
        isStreamingRef.current = false;
      }
    },
    [initializeStream, playVideo]
  );

  const stopStream = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      isStreamingRef.current = false;
      stopRendering();
    }
  }, [stopRendering]);

  const flipCamera = useCallback(() => {
    const newFacingMode: FacingMode = facingMode === 'environment' ? 'user' : 'environment';
    startStream(newFacingMode);
  }, [facingMode, startStream]);

  const capturePhoto = useCallback(() => {
    if (isCaptured) {
      setIsCaptured(false);
      if (videoRef.current?.srcObject) {
        startRendering();
      }
    } else {
      drawCanvasWithEffects();
      setIsCaptured(true);
      stopRendering();
    }
  }, [isCaptured, startRendering, drawCanvasWithEffects, stopRendering]);

  const saveImage = useCallback(() => {
    if (!canvasRef.current || !isCaptured) return;
    saveCanvasImage(canvasRef.current);
  }, [canvasRef, isCaptured]);

  useEffect(() => {
    if (!isCaptured && !isStreamingRef.current && videoRef.current && !videoRef.current.srcObject) {
      startStream(facingMode);
    }
    return () => {
      stopStream();
      stopRendering();
    };
  }, [facingMode, isCaptured, startStream, stopRendering, stopStream]);

  useEffect(() => {
    if (!isCaptured && videoRef.current && videoRef.current.srcObject) {
      startRendering();
    }
  }, [isCaptured, startRendering]);

  return {
    videoRef,
    canvasRef,
    facingMode,
    isCaptured,

    // 조작 함수들
    flipCamera,
    capturePhoto,
    startStream,
    stopStream,
    saveImage
  };
};
