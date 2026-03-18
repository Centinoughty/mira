interface TitleProps {
  className?: string;
  text: string;
}

export default function Title({ className, text }: TitleProps) {
  return (
    <>
      <h1 className={`text-3xl font-semibold ${className}`}>{text}</h1>
    </>
  );
}
