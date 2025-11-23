import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Box, IconButton, Checkbox } from '@mui/material';
import MUITable from '@mui/material/Table';
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
  topToolBar?: TopToolBarItem[];
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
    {topToolBar && <Box>{getTopToolBar(topToolBar)}</Box>}
    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none' }}>
      <MUITable sx={{ minWidth: 650 }} aria-label="table" {...getTableProps()}>
        <TableHead sx={{ bgcolor: 'hsl(var(--table-header-bg))', borderBottom: '2px solid hsl(var(--table-border))' }}>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell 
                  sx={{ 
                    color: 'hsl(var(--table-text))', 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    py: 2
                  }} 
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {data.length ? rows.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow 
                style={{ 
                  backgroundColor: row.isSelected ? 'hsl(var(--table-selected))' : 'white',
                  cursor: 'pointer',
                  transition: 'background-color 150ms'
                }} 
                sx={{
                  '&:hover': {
                    bgcolor: row.isSelected ? 'hsl(var(--table-selected))' : 'hsl(var(--table-hover))'
                  },
                  borderBottom: '1px solid hsl(var(--table-border))'
                }}
                {...row.getRowProps()} 
                onClick={(e) => selectRow(row)}
              >
                {row.cells.map(cell => {
                  return (
                    <TableCell 
                      sx={{ 
                        color: 'hsl(var(--table-text))',
                        fontSize: '0.875rem',
                        py: 2
                      }} 
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          }) : (
            <TableRow key={'noDataRow'}>
              <TableCell 
                key={'noData'} 
                colSpan={headerGroups[0]?.headers.length || 1}
                sx={{ 
                  textAlign: 'center', 
                  color: 'hsl(var(--table-text-muted))',
                  py: 8,
                  fontSize: '0.875rem'
                }}
              >
                No tasks available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </MUITable>
      </TableContainer>
      </>
  );
}

