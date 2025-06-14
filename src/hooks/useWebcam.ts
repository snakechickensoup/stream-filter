import { useCallback, useEffect, useRef } from 'react';
import { useDeviceType } from './useDeviceType';
import { useCanvasRenderer } from './useCanvasRenderer';

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isMobile } = useDeviceType();
  const renderCanvas = useCanvasRenderer(videoRef);

  const startStream = useCallback(async () => {
    try {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 320, ideal: isMobile ? 320 : 480, max: 1280 },
          height: { min: 240, ideal: isMobile ? 240 : 360, max: 720 },
          frameRate: { min: 10, ideal: isMobile ? 15 : 20, max: 30 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }, [isMobile]);

  const stopStream = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    startStream();
    return () => stopStream();
  }, [startStream, stopStream]);

  return {
    videoRef,
    canvasRef: renderCanvas.canvasRef
  };
};
