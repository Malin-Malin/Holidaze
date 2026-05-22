type PopoutCardProps = {
  icon?: React.ReactNode;
  title: string;
  text: string;
};

const PopoutCard = ({ icon, title, text }: PopoutCardProps) => {
  return (
    <article className="group rounded-md border border-[var(--border)] bg-[var(--bg)] p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-honey)]/60 hover:shadow-md">
      <span
        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl text-[var(--color-honey)]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h2 className="mb-2 text-lg font-semibold text-[var(--text-h)]">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-[var(--text)]">{text}</p>
    </article>
  );
};

export default PopoutCard;
