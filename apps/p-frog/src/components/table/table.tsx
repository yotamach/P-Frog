import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import MUITable from '@mui/material/Table';

import styles from './table.scss';

export interface ColumnProps {
  title: string;
  align: 'left' | 'right' | 'center';
  field: string;
};

interface RowProps {
  key: string;
  values: CellProps[];
};

interface CellProps {
  column: string;
  value: any;
};

interface TableProps {
  columns: ColumnProps[];
  data: RowProps[];
}

export default function Table({ columns, data }: TableProps) {
  return (
    <TableContainer component={Paper}>
      <MUITable sx={{ minWidth: 650 }} aria-label="table">
        <TableHead sx={{ bgcolor: 'primary.main'}}>
          <TableRow>
            {columns.map((column: ColumnProps) => <TableCell style={{ color: 'white' }} key={column.title} align={column.align}>{column.title}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? data.map((row: RowProps) => (
            <TableRow
              key={row.key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {columns.map(({ title, field }) => (<TableCell key={title} component="th" scope="row">
                {row.values[field]}
              </TableCell>))}
            </TableRow>
          )) : <TableRow key={'noDataRow'}><TableCell key={'noData'}>No data</TableCell></TableRow>}
        </TableBody>
        </MUITable>
      </TableContainer>
  );
}
