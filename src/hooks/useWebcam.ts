import { useEffect, useRef } from 'react';

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    const startWebcam = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 240 },
              height: { ideal: 180 },
              frameRate: { ideal: 20, max: 30 }
            }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (error) {
          console.error('웹캠에 접근할 수 없습니다.:', error);
        }
      } else {
        console.error('지원하지 않는 브라우저입니다.');
      }
    };

    const renderFrame = (currentTime: number) => {
      if (currentTime - lastFrameTimeRef.current < 33) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
        return;
      }
      lastFrameTimeRef.current = currentTime;

      if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
        const context = canvasRef.current.getContext('2d');
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
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 12) {
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
          context.putImageData(imageData, 0, 0);
        }
      }
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    const handleVideoLoaded = () => {
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.width = 480;
        canvasRef.current.height = 360;
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    startWebcam();

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('loadedmetadata', handleVideoLoaded);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('loadedmetadata', handleVideoLoaded);

        if (videoElement.srcObject) {
          const tracks = (videoElement.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    videoRef,
    canvasRef
  };
};
