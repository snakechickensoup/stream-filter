const Header = () => {
  return (
    <header className='window-header'>
      <h2 className='window-title'>stream filter</h2>
      <button type='button' aria-label='close' className='button close-button'>
        <span className='icon icon-close'></span>
      </button>
    </header>
  );
};

export default Header;
