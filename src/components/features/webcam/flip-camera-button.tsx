import { RefreshCcw } from 'lucide-react';
import Button from '../../ui/button/button';
import s from './flip-camera-button.module.css';

type FlipCameraButtonProps = {
  onFlipCamera: () => void;
};

const FlipCameraButton = (props: FlipCameraButtonProps) => {
  const { onFlipCamera } = props;
  return (
    <Button aria-label='화면 전환 버튼' onClick={onFlipCamera} className={s.flipButton}>
      <RefreshCcw size={14} />
      <span>전환</span>
    </Button>
  );
};

export default FlipCameraButton;
