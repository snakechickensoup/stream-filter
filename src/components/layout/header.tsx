import { X } from 'lucide-react';

const Header = () => {
  return (
    <header className='window-header'>
      <h2 className='window-title'>stream filter</h2>
      <button type='button' aria-label='close' className='button close-button'>
        <X size={20} />
      </button>
    </header>
  );
};

export default Header;
