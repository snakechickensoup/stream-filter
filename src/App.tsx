import Canvas from './components/canvas';
import Header from './components/layout/header';
import Nav from './components/layout/nav';
import PhotoButton from './components/photo-button';
import { useWebcam } from './hooks/useWebcam';
import './App.css';

const App = () => {
  const { canvasRef, videoRef, flipCamera } = useWebcam();
  return (
    <main className='window border-border'>
      <Header />
      <div className='window-content'>
        <Nav onFlipCamera={flipCamera} />
        <hr />
        <Canvas canvasRef={canvasRef} videoRef={videoRef} />
        <hr />
        <PhotoButton />
      </div>
    </main>
  );
};

export default App;
