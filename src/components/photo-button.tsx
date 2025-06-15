import { Camera } from 'lucide-react';

const PhotoButton = () => {
  return (
    <div className='photo'>
      <button className='button' aria-label='촬영 버튼' type='button'>
        <Camera size={16} />
        <span className='text'>촬영</span>
      </button>
    </div>
  );
};

export default PhotoButton;
