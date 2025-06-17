import React, { useCallback, useEffect, useRef } from 'react';
import { useDeviceType } from './useDeviceType';

import logoImage from '/assets/images/logo.png';

export const useCanvasRenderer = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const logoImageRef = useRef<HTMLImageElement>(new Image());
  const { isMobile } = useDeviceType();

  useEffect(() => {
    logoImageRef.current.src = logoImage;
  }, []);

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

  const drawCanvas = useCallback(
    (
      videoRef: React.RefObject<HTMLVideoElement>,
      canvasRef: React.RefObject<HTMLCanvasElement>,
      context: CanvasRenderingContext2D
    ) => {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      const videoAspectRatio = videoWidth / videoHeight;
      const canvasAspectRatio = canvasRef.current.width / canvasRef.current.height;

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = videoWidth;
      let sourceHeight = videoHeight;
      if (videoAspectRatio > canvasAspectRatio) {
        sourceWidth = videoHeight * canvasAspectRatio;
        sourceX = (videoWidth - sourceWidth) / 2;
      } else {
        sourceHeight = videoWidth / canvasAspectRatio;
        sourceY = (videoHeight - sourceHeight) / 2;
      }
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(
        videoRef.current,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    },
    []
  );

  const drawLogo = useCallback((context: CanvasRenderingContext2D) => {
    const logo = logoImageRef.current;
    if (logo.complete && logo.naturalWidth > 0) {
      const logoWidth = canvasRef.current.width * 0.28;
      const logoHeight = (logo.naturalHeight / logo.naturalWidth) * logoWidth;

      context.drawImage(logo, 10, 10, logoWidth, logoHeight);
    }
  }, []);

  const drawCanvasWithEffects = useCallback(() => {
    if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
      const context = canvasRef.current.getContext('2d', {
        alpha: false,
        willReadFrequently: true
      });

      if (context) {
        drawCanvas(videoRef, canvasRef, context);
        const imageData = context.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        applyCanvasEffects(imageData);
        context.putImageData(imageData, 0, 0);
        drawLogo(context);
      }
    }
  }, [applyCanvasEffects, drawCanvas, drawLogo, videoRef]);

  const renderFrame = useCallback(
    (currentTime: number) => {
      if (currentTime - lastFrameTimeRef.current < 33) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      lastFrameTimeRef.current = currentTime;
      drawCanvasWithEffects();
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    },
    [drawCanvasWithEffects]
  );

  const startRendering = useCallback(() => {
    if (canvasRef.current && videoRef.current && videoRef.current.videoWidth > 0) {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      const maxSize = isMobile ? 320 : 480;
      let canvasSize = Math.min(videoWidth, videoHeight, maxSize);

      if (canvasSize === 0) {
        canvasSize = maxSize;
      }

      canvasRef.current.width = canvasSize;
      canvasRef.current.height = canvasSize;

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
    stopRendering,
    drawCanvasWithEffects
  };
};
