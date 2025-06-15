import { useWebcam } from '../hooks/useWebcam';

const Canvas = () => {
  const { canvasRef, videoRef } = useWebcam();
  return (
    <div className='canvas-wrapper'>
      <video id='video' ref={videoRef} style={{ display: 'none' }}></video>
      <canvas id='canvas' ref={canvasRef}></canvas>
    </div>
  );
};

export default Canvas;
