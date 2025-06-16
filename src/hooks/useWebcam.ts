import { useCallback, useEffect, useRef, useState } from 'react';
import { useDeviceType } from './useDeviceType';
import { useCanvasRenderer } from './useCanvasRenderer';
import type { FacingMode } from '../libs/types';

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isCaptured, setIsCaptured] = useState<boolean>(false);
  const { isMobile } = useDeviceType();
  const { canvasRef, startRendering, stopRendering, applyCanvasEffects } =
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
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsStreaming(true);
      } catch (error) {
        console.error('Error playing video:', error);
        setIsStreaming(false);
      }
    }
  }, []);

  const startStream = useCallback(
    async (facing: FacingMode) => {
      if (isStreaming) return;
      setIsStreaming(true);

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
        setIsStreaming(false);
      }
    },
    [initializeStream, isStreaming, playVideo]
  );

  const stopStream = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
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
    } else {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
        if (context) {
          const { width, height } = canvas;
          context.drawImage(videoRef.current, 0, 0, width, height);
          const imageData = context.getImageData(0, 0, width, height);
          applyCanvasEffects(imageData);
          context.putImageData(imageData, 0, 0);

          setIsCaptured(true);
          stopRendering();
        }
      }
    }
  }, [isCaptured, canvasRef, applyCanvasEffects, stopRendering]);

  useEffect(() => {
    if (!isCaptured && !isStreaming && videoRef.current && !videoRef.current.srcObject) {
      startStream(facingMode);
    }
    return () => {
      stopStream();
      stopRendering();
    };
  }, [facingMode, isCaptured, isStreaming, startStream, stopRendering, stopStream]);

  useEffect(() => {
    if (!isCaptured && videoRef.current && videoRef.current.srcObject) {
      startRendering();
    }
  }, [isCaptured, startRendering]);

  return {
    videoRef,
    canvasRef: canvasRef,

    // 스트림 상태
    isStreaming,
    facingMode,
    isCaptured,

    // 조작 함수들
    flipCamera,
    capturePhoto,
    startStream,
    stopStream
  };
};
