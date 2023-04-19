import React, { useEffect, useState } from 'react';
import { Paper, Table, TableCell, TableContainer, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import AplicacionListRow from './AplicacionListRow';
import AplicacionTableHead from './AplicacionTableHead';
import AplicacionTableToolbar from './AplicacionTableToolbar';
import { getComparator, stableSort } from '../../../@jumbo/utils/tableHelper';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAplicacion, getAplicaciones, setCurrentAplicacion } from '../../../redux/actions/Aplicaciones';
import AddEditAplicacion from './AddEditAplicacion';
import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import AplicacionDetailView from './AplicacionDetailView';
import NoRecordFound from './NoRecordFound';
import IntlMessages from '@jumbo/utils/IntlMessages';

const AplicacionesModule = () => {
  const classes = useStyles();
  const { aplicaciones } = useSelector(({ aplicacionesReducer }) => aplicacionesReducer);
  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openUserDialog, setOpenAplicacionDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedAplicacion, setSelectedAplicacion] = useState({ name: '' });
  const [aplicacionesFetched, setAplicacionesFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [empresaCodigo, setEmpresaCodigo] = useState('');

  const dispatch = useDispatch();

  //************************Inicio useEffect************************************* */

  useEffect(() => {
    dispatch(
      getAplicaciones(empresaCodigo, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setAplicacionesFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);

  //************************Fin useEffect************************************* */

  const handleCloseUserDialog = () => {
    setOpenAplicacionDialog(false);
    dispatch(setCurrentAplicacion(null));
    dispatch(
      getAplicaciones(empresaCodigo, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setAplicacionesFetched(true);
      }),
    );
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = aplicaciones.map(n => n.appId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (event, id) => {
    /*  const selectedIndex = selected.indexOf(id);
     let newSelected = [];
 
     if (selectedIndex === -1) {
       newSelected = newSelected.concat(selected, id);
     } else if (selectedIndex === 0) {
       newSelected = newSelected.concat(selected.slice(1));
     } else if (selectedIndex === selected.length - 1) {
       newSelected = newSelected.concat(selected.slice(0, -1));
     } else if (selectedIndex > 0) {
       newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
     }
 
     setSelected(newSelected); */
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAplicacionView = aplicacion => {
    dispatch(setCurrentAplicacion(aplicacion));
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    dispatch(setCurrentAplicacion(null));
  };

  const handleAplicacionEdit = aplicacion => {
    dispatch(setCurrentAplicacion(aplicacion));
    setOpenAplicacionDialog(true);
  };

  const handleAplicacionDelete = aplicacion => {
    setSelectedAplicacion(aplicacion);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);

    dispatch(deleteAplicacion(selectedAplicacion.id));
    dispatch(
      getAplicaciones(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setAplicacionesFetched(true);
      }),
    );
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const isSelected = id => selected.indexOf(id) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <AplicacionTableToolbar
          selected={selected}
          setSelected={setSelected}
          onAplicacionAdd={setOpenAplicacionDialog}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <TableContainer className={classes.container}>
          <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
            <AplicacionTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={aplicaciones.length}
            />
            <TableBody>
              {!!aplicaciones.length ? (
                stableSort(aplicaciones, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <AplicacionListRow
                      key={index}
                      row={row}
                      onRowClick={handleRowClick}
                      onAplicacionEdit={handleAplicacionEdit}
                      onAplicacionDelete={handleAplicacionDelete}
                      onAplicacionView={handleAplicacionView}
                      isSelected={isSelected}
                    />
                  ))
              ) : (
                <TableRow style={{ height: 53 * 6 }}>
                  <TableCell colSpan={7} rowSpan={10}>
                    {isFilterApplied ? (
                      <NoRecordFound>{<IntlMessages id="aplicaciones.appModule.filterNoRecordsFound" />}</NoRecordFound>
                    ) : (
                      <NoRecordFound>
                        {aplicacionesFetched ? (
                          <IntlMessages id="aplicaciones.appModule.noRecordsFound" />
                        ) : (
                          <IntlMessages id="aplicaciones.appModule.loadingaplicaciones" />
                        )}
                      </NoRecordFound>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={aplicaciones.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {openUserDialog && <AddEditAplicacion open={openUserDialog} onCloseDialog={handleCloseUserDialog} />}
      {openViewDialog && <AplicacionDetailView open={openViewDialog} onCloseDialog={handleCloseViewDialog} />}

      <ConfirmDialog
        open={openConfirmDialog}
        title={<IntlMessages id="aplicaciones.appModule.deleteConfirm" />}
        content={<IntlMessages id="aplicaciones.appModule.deleteMessage" values={{ code: selectedAplicacion.id }} />}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AplicacionesModule;
