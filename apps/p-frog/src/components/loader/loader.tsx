import { Backdrop, CircularProgress } from '@mui/material';
import './loader.module.scss';

export interface LoaderProps {
  visible: boolean;
}

export function Loader({ visible = false }: LoaderProps) {
  return (
    <Backdrop
        sx={{ bgcolor: 'background.default', position: 'absolute' }}
        open={visible}
      >
        <CircularProgress variant='indeterminate' color="inherit" size="5rem" />
    </Backdrop>
  );
}

export default Loader;
