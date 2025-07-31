type AppEmptyProps = React.PropsWithChildren<{ text?: string }>;

export default function AppEmpty({ children, text }: AppEmptyProps) {
  return (
    <div className="bg-muted flex h-screen w-screen flex-col items-center justify-center">
      <img alt="Pilot" className="h-16" src="/logo.svg" />
      <p className="text-muted-foreground mt-1 text-sm">{text}</p>
      {children}
    </div>
  );
}
