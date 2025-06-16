import s from './webcam.module.css';

type WebcamProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
};

const Webcam = (props: WebcamProps) => {
  const { canvasRef, videoRef } = props;
  return (
    <div className={s.webcamWrapper}>
      <video
        id='video'
        ref={videoRef}
        style={{ display: 'none' }}
        webkit-playsinline='true'
        autoPlay
        playsInline
        muted
      />
      <canvas id='canvas' ref={canvasRef} className={s.canvas} />
    </div>
  );
};

export default Webcam;
