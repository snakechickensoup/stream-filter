import { Camera } from 'lucide-react';

const Nav = () => {
  return (
    <div className='camera'>
      <span>... </span>
      <button className='button camera-button' type='button' aria-label='camera'>
        <Camera size={16} />
        <span className='text'>촬영</span>
      </button>
    </div>
  );
};

export default Nav;
