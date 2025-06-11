import Canvas from './components/canvas';
import FilterTabs from './components/filter-tabs';
import Header from './components/layout/header';
import Nav from './components/layout/nav';
import './App.css';

const App = () => {
  return (
    <main className='window border-border'>
      <Header />
      <div className='window-content'>
        <Nav />
        <hr />
        <Canvas />
        <hr />
        <FilterTabs />
      </div>
    </main>
  );
};

export default App;
