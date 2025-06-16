import { RefreshCcw } from 'lucide-react';
import Button from '../../ui/button/button';
import s from './nav.module.css';

type NavProps = {
  onFlipCamera: () => void;
};

const Nav = (props: NavProps) => {
  const { onFlipCamera } = props;
  return (
    <div className={s.nav}>
      <span>... </span>
      <Button aria-label='화면 전환 버튼' onClick={onFlipCamera} className={s.flipButton}>
        <RefreshCcw size='16' />
        <span className={s.flipText}>전환</span>
      </Button>
    </div>
  );
};

export default Nav;
