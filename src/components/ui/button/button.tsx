import s from './button.module.css';

type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const Button = (props: ButtonProps) => {
  const {
    onClick,
    children,
    className = '',
    ariaLabel = '',
    type = 'button',
    disabled = false
  } = props;
  return (
    <button
      onClick={onClick}
      className={`${s.button} ${className}`}
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
