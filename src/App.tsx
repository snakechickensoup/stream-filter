import Webcam from './components/features/webcam/webcam';
import Nav from './components/layout/nav/nav';
import Window from './components/ui/window/window';
import { useWebcam } from './hooks/useWebcam';

const App = () => {
  const { canvasRef, videoRef, flipCamera } = useWebcam();
  return (
    <Window title='c a m e r a '>
      <Nav onFlipCamera={flipCamera} />
      <Webcam canvasRef={canvasRef} videoRef={videoRef} />
    </Window>
  );
};

export default App;
