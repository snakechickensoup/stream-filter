import Button from '../../ui/button/button';

import s from './capture-button.module.css';

type CaptureButtonProps = {
  onCapture: () => void;
  isCaptured: boolean;
};

const CaptureButton = (props: CaptureButtonProps) => {
  const { onCapture, isCaptured } = props;
  const buttonText = isCaptured ? '다시 촬영' : '촬영하기';
  return (
    <div className={s.captureWrapper}>
      <Button className={s.captureButton} aria-label='촬영 버튼' onClick={onCapture}>
        {buttonText}
      </Button>
    </div>
  );
};

export default CaptureButton;
