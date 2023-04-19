import React, { useEffect, useState } from 'react';
import { Paper, Table, TableCell, TableContainer, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import ProveedorListRow from './ProveedorListRow';
import ProveedorTableHead from './ProveedorTableHead';
import ProveedorTableToolbar from './ProveedorTableToolbar';
import ProveedorDetailView from './ProveedorDetailView';
import AddEditProveedor from './AddEditProveedor';
import ProveedorCategoryManagers from './ProveedorCategoryManagers';
import { getComparator, stableSort } from '../../../@jumbo/utils/tableHelper';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProveedor, getProveedores, setCurrentProveedor } from '../../../redux/actions/Proveedores';
import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import NoRecordFound from './NoRecordFound';
import IntlMessages from '@jumbo/utils/IntlMessages';

const ProveedoresModule = () => {
  const classes = useStyles();
  const { proveedores } = useSelector(({ proveedoresReducer }) => proveedoresReducer);
  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openProveedorDialog, setOpenProveedorDialog] = useState(false);
  const [openProveedorCategoryManagersDialog, setOpenProveedorCategoryManagersDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedProveedor, setSelectedRole] = useState({ name: '' });
  const [proveedoresFetched, setProveedoresFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [empresaCodigo, setEmpresaCodigo] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getProveedores(empresaCodigo, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setProveedoresFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);

  const handleCloseUserDialog = () => {
    setOpenProveedorDialog(false);
    dispatch(setCurrentProveedor(null));
    dispatch(
      getProveedores(empresaCodigo, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setProveedoresFetched(true);
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
      const newSelected = proveedores.map(n => n.provId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (event, id) => {
    /*   const selectedIndex = selected.indexOf(id);
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

  const handleProveedorView = proveedor => {
    dispatch(setCurrentProveedor(proveedor));
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    dispatch(setCurrentProveedor(null));
  };

  const handleProveedorEdit = proveedor => {
    dispatch(setCurrentProveedor(proveedor));
    setOpenProveedorDialog(true);
  };

  const handleProveedorCategoryManagers = proveedor => {
    dispatch(setCurrentProveedor(proveedor));
    setOpenProveedorCategoryManagersDialog(true);
  };

  const handleCloseProveedorCategoryManagersDialog = () => {
    setOpenProveedorCategoryManagersDialog(false);
    dispatch(setCurrentProveedor(null));
  };

  const handleProveedorDelete = proveedor => {
    setSelectedRole(proveedor);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);

    dispatch(deleteProveedor(selectedProveedor.provId));
    dispatch(
      getProveedores(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setProveedoresFetched(true);
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
        <ProveedorTableToolbar
          selected={selected}
          setSelected={setSelected}
          onProveedorAdd={setOpenProveedorDialog}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <TableContainer className={classes.container}>
          <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
            <ProveedorTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={proveedores.length}
            />
            <TableBody>
              {!!proveedores.length ? (
                stableSort(proveedores, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <ProveedorListRow
                      key={index}
                      row={row}
                      onRowClick={handleRowClick}
                      onProveedorEdit={handleProveedorEdit}
                      onProveedorDelete={handleProveedorDelete}
                      onProveedorView={handleProveedorView}
                      onProveedorCategoryManagers={handleProveedorCategoryManagers}
                      isSelected={isSelected}
                    />
                  ))
              ) : (
                <TableRow style={{ height: 53 * 6 }}>
                  <TableCell colSpan={7} rowSpan={10}>
                    {isFilterApplied ? (
                      <NoRecordFound>{<IntlMessages id="proveedores.appModule.filterNoRecordsFound" />}</NoRecordFound>
                    ) : (
                      <NoRecordFound>
                        {proveedoresFetched ? (
                          <IntlMessages id="proveedores.appModule.noRecordsFound" />
                        ) : (
                          <IntlMessages id="proveedores.appModule.loadingProveedores" />
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
          count={proveedores.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {openProveedorDialog && <AddEditProveedor open={openProveedorDialog} onCloseDialog={handleCloseUserDialog} />}
      {openViewDialog && <ProveedorDetailView open={openViewDialog} onCloseDialog={handleCloseViewDialog} />}
      {openProveedorCategoryManagersDialog && <ProveedorCategoryManagers open={openProveedorCategoryManagersDialog} onCloseDialog={handleCloseProveedorCategoryManagersDialog} />}

      <ConfirmDialog
        open={openConfirmDialog}
        title={<IntlMessages id="proveedores.appModule.deleteConfirm" />}
        content={<IntlMessages id="proveedores.appModule.deleteMessage" values={{ code: selectedProveedor.provId }} />}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProveedoresModule;
