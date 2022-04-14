import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Box, IconButton, Checkbox } from '@mui/material';
import MUITable from '@mui/material/Table';
import styles from './table.scss';
import { ReactElement } from 'react';
import { useTable, Column, useRowSelect, Row } from 'react-table';
import React, { useEffect, forwardRef } from 'react';

export interface ColumnProps {
  title: string;
  align: 'left' | 'right' | 'center';
  field: string;
};

interface CellProps {
  column: string;
  value: any;
};

export interface TopToolBarItem {
  icon: ReactElement;
  label: string; 
  click: (event: React.MouseEvent<HTMLButtonElement>, selectedRows: Row<object>[]) => void;
}

interface TableProps {
  columns: Column<any>[];
  data: any[];
  topToolBar: TopToolBarItem[];
}

export default function Table({ topToolBar, columns, data }: TableProps) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    selectedFlatRows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
    },
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push((columns: any) => [
        // Let's make a column for selection
        {
          id: 'selection',
          Header: '',
          Cell: ({ row, toggleAllRowsSelected }) => (
            <div>
              <Checkbox 
              {...row.getToggleRowSelectedProps({
                onChange: () => {
                  const selected = row.isSelected;
                  toggleAllRowsSelected(false);
                  row.toggleRowSelected(!selected);
                }
              })} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  )

  const topToolBarPanel = getTopToolBar(topToolBar, selectedFlatRows);
  return (
    <TableContainer component={Paper}>
      {<Box>
        {topToolBarPanel}
      </Box>}
      <MUITable sx={{ minWidth: 650 }} aria-label="table" {...getTableProps()}>
        <TableHead sx={{ bgcolor: 'primary.main' }}>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell sx={{ color: 'background.default' }} {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {data.length ? rows.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                })}
              </TableRow>
            )
          }) : <TableRow key={'noDataRow'}><TableCell key={'noData'}>No data</TableCell></TableRow>}
        </TableBody>
        </MUITable>
      </TableContainer>
  );
}


function getTopToolBar(topToolBar: TopToolBarItem[], selectedRows: Row<object>[] = []) {
  const buttonsLists = topToolBar.map((button) => (
      <IconButton key={button.label} onClick={(event) => button.click(event, selectedRows)} aria-label={button.label} size="large">
        {button.icon}
      </IconButton>));
  return <Paper elevation={2}>
      {buttonsLists}
  </Paper>
}
