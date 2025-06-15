import { RefreshCcw } from 'lucide-react';

type NavProps = {
  onFlipCamera: () => void;
};

const Nav = (props: NavProps) => {
  const { onFlipCamera } = props;
  return (
    <div className='flip'>
      <span>... </span>
      <button
        className='button flip-button'
        type='button'
        aria-label='화면 전환 버튼'
        onClick={onFlipCamera}>
        <RefreshCcw size='16' />
        <span className='text'>전환</span>
      </button>
    </div>
  );
};

export default Nav;
