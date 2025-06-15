import { useCallback, useEffect, useRef } from 'react';
import { useDeviceType } from './useDeviceType';

export const useCanvasRenderer = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const { isMobile } = useDeviceType();

  const applyCanvasEffects = useCallback(
    (imageData: ImageData) => {
      const { data } = imageData;
      const step = isMobile ? 8 : 4;

      for (let i = 0; i < data.length; i += step) {
        // 파란색 효과
        data[i] = Math.max(0, data[i] - 25);
        data[i + 1] = Math.max(0, data[i + 1] - 12);
        data[i + 2] = Math.min(255, data[i + 2] + 35);

        // 노이즈 효과
        if (Math.random() < 0.08) {
          const noiseValue = (Math.random() - 0.5) * 120;
          data[i] = Math.max(0, Math.min(255, data[i] + noiseValue));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noiseValue));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noiseValue));
        }
      }
    },
    [isMobile]
  );

  const renderFrame = useCallback(
    (currentTime: number) => {
      if (currentTime - lastFrameTimeRef.current < 33) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      lastFrameTimeRef.current = currentTime;

      if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
        const context = canvasRef.current.getContext('2d', {
          alpha: false,
          willReadFrequently: true
        });
        if (context) {
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          const imageData = context.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          applyCanvasEffects(imageData);
          context.putImageData(imageData, 0, 0);
        }
      }
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    },
    [videoRef, applyCanvasEffects]
  );

  const startRendering = useCallback(() => {
    if (canvasRef.current && videoRef.current) {
      const width = isMobile ? 320 : 480;
      const height = isMobile ? 240 : 360;

      canvasRef.current.width = width;
      canvasRef.current.height = height;
      lastFrameTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    }
  }, [isMobile, renderFrame, videoRef]);

  const stopRendering = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('loadedmetadata', startRendering);
      return () => {
        videoElement.removeEventListener('loadedmetadata', startRendering);
        stopRendering();
      };
    }
  }, [startRendering, stopRendering, videoRef]);

  return {
    canvasRef,
    startRendering,
    stopRendering
  };
};
