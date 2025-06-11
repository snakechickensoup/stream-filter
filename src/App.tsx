import './App.css';

const App = () => {
  return (
    <main className='window border-border'>
      <header className='window-header'>
        <h2 className='window-title'>stream filter</h2>
        <button type='button' aria-label='close' className='button close-button'>
          <span className='icon icon-close'></span>
        </button>
      </header>

      <div className='window-content'>
        <div className='camera'>
          <span>... </span>
          <button className='button camera-button' type='button' aria-label='camera'>
            <span className='icon icon-camera'></span>
            <span className='text'>촬영</span>
          </button>
        </div>

        <hr />

        <div className='canvas-wrapper'>
          <video id='video' hidden></video>
          <canvas id='canvas'></canvas>
        </div>

        <hr />

        <ul className='tab-wrapper'>
          <li className='tab'>필터 1</li>
          <li className='tab'>필터 2</li>
          <li className='tab'>필터 3</li>
          <li className='tab'>필터 4</li>
        </ul>
      </div>
    </main>
  );
};

export default App;
