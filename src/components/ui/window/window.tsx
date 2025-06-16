import s from './window.module.css';

type WindowProps = {
  title: string;
  children: React.ReactNode;
  headerIcon?: React.ReactElement;
  closeElement?: React.ReactElement;
};

const Window = (props: WindowProps) => {
  const { title, children, closeElement, headerIcon } = props;
  return (
    <main className={s.window + ' border-border'}>
      <header className={s.windowHeader}>
        {headerIcon && <span className={s.windowIcon}>{headerIcon}</span>}
        <h2 className={s.windowTitle}>{title}</h2>
        {closeElement}
      </header>
      <div className={s.windowContent}>
        <hr />
        {children}
        <hr />
      </div>
    </main>
  );
};

export default Window;
