import SaveButton from '../../features/save/save-button';
import FlipCameraButton from '../../features/webcam/flip-camera-button';
import s from './nav.module.css';

type NavProps = {
  onFlipCamera: () => void;
  isCaptured: boolean;
};

const Nav = (props: NavProps) => {
  const { onFlipCamera, isCaptured } = props;
  return (
    <div className={s.nav}>
      <span>... </span>
      {isCaptured ? (
        <SaveButton onSave={() => {}} />
      ) : (
        <FlipCameraButton onFlipCamera={onFlipCamera} />
      )}
    </div>
  );
};

export default Nav;
