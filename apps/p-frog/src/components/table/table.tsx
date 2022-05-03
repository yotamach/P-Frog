import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Box, IconButton, Checkbox } from '@mui/material';
import MUITable from '@mui/material/Table';
import styles from './table.scss';
import { ReactElement, useMemo } from 'react';
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
  disabled?: boolean;
  click: (event: React.MouseEvent<HTMLButtonElement>, selectedRows: Row<object>[]) => void;
}

interface TableProps {
  columns: Column<any>[];
  data: any[];
  topToolBar: TopToolBarItem[];
  onSelectRow: (row: Row<object> | null) => void;
}

export default function Table({ topToolBar, columns, data, onSelectRow }: TableProps) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    selectedFlatRows,
    toggleAllRowsSelected,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useRowSelect,
  )

  const selectRow = (row: Row<object>) => {
      const selected = row.isSelected;
      toggleAllRowsSelected(false);
      row.toggleRowSelected(!selected);
      onSelectRow(!selected ? row : null);
  }

  function getTopToolBar(topToolBar: TopToolBarItem[]) {
    const buttonsLists = topToolBar.map((button) => (
        <IconButton key={button.label} onClick={(event) => button.click(event, selectedFlatRows)} aria-label={button.label} size="large" disabled={button.disabled}>
          {button.icon}
        </IconButton>));
    return <Paper elevation={2}>
        {buttonsLists}
    </Paper>
  }

  return (
    <>
    <Box>{getTopToolBar(topToolBar)}</Box>
    <TableContainer component={Paper}>
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
              <TableRow style={{ backgroundColor: row.isSelected ? '#ccc' : 'transparent' }} {...row.getRowProps()} onClick={(e) => selectRow(row)}>
                {row.cells.map(cell => {
                  return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                })}
              </TableRow>
            )
          }) : <TableRow key={'noDataRow'}><TableCell key={'noData'}>No data</TableCell></TableRow>}
        </TableBody>
        </MUITable>
      </TableContainer>
      </>
  );
}

