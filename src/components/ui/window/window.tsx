import s from './window.module.css';

type WindowProps = {
  title: string;
  children: React.ReactNode;
  closeElement?: React.ReactElement;
};

const Window = (props: WindowProps) => {
  const { title, children, closeElement } = props;
  return (
    <main className={s.window + ' border-border'}>
      <header className={s.windowHeader}>
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
