import { SaveIcon } from 'lucide-react';
import Button from '../../ui/button/button';
import s from './save-button.module.css';

type SaveButtonProps = {
  onSave: () => void;
};

const SaveButton = (props: SaveButtonProps) => {
  const { onSave } = props;
  return (
    <div className={s.saveWrapper}>
      <Button className={s.saveButton} aria-label='저장 버튼' onClick={onSave}>
        <SaveIcon size={14} />
        저장
      </Button>
    </div>
  );
};

export default SaveButton;
