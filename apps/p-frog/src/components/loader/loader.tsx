export interface LoaderProps {
  visible: boolean;
}

export function Loader({ visible = false }: LoaderProps) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/75 z-10">
      <div className="w-20 h-20 border-4 border-border border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default Loader;
