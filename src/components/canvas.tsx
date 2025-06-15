type CanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
};

const Canvas = (props: CanvasProps) => {
  const { canvasRef, videoRef } = props;
  return (
    <div className='canvas-wrapper'>
      <video
        id='video'
        ref={videoRef}
        style={{ display: 'none' }}
        webkit-playsinline={true}
        autoPlay
        playsInline
        muted
      />
      <canvas id='canvas' ref={canvasRef} />
    </div>
  );
};

export default Canvas;
