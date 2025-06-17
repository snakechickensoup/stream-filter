import { Camera } from 'lucide-react';
import Webcam from './components/features/webcam/webcam';
import Nav from './components/layout/nav/nav';
import Window from './components/ui/window/window';
import Separator from './components/ui/separator/separator';
import CaptureButton from './components/features/capture/capture-button';
import { useWebcam } from './hooks/useWebcam';

const App = () => {
  const { canvasRef, videoRef, flipCamera, capturePhoto, isCaptured } = useWebcam();
  return (
    <Window title='Camera' headerIcon={<Camera size={16} />}>
      <Nav onFlipCamera={flipCamera} isCaptured={isCaptured} />
      <Separator />
      <Webcam canvasRef={canvasRef} videoRef={videoRef} />
      <Separator />
      <CaptureButton onCapture={capturePhoto} isCaptured={isCaptured} />
    </Window>
  );
};

export default App;
