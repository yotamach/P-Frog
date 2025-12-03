export interface LoaderProps {
  visible: boolean;
}

export function Loader({ visible = false }: LoaderProps) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
      <div 
        className="w-20 h-20 border-4 rounded-full animate-spin"
        style={{
          borderColor: 'hsl(var(--border))',
          borderTopColor: 'hsl(var(--sidebar-active))'
        }}
      />
    </div>
  );
}

export default Loader;
