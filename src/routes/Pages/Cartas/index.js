import React, { useEffect, useState } from 'react';
import { Paper, Table, TableCell, TableContainer, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import CartaListRow from './CartaListRow';
import CartaTableHead from './CartaTableHead';
import CartaTableToolbar from './CartaTableToolbar';
import { getComparator, stableSort } from '../../../@jumbo/utils/tableHelper';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCarta, getCartas, setCurrentCarta } from '../../../redux/actions/Cartas';
import { setCategoryManagers } from '../../../redux/actions/CategoryManagers';
import { setProductosOrdenCompra } from '../../../redux/actions/OrdenesCompra';
import AddEditCarta from './AddEditCarta';
import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import CartaDetailView from './CartaDetailView';
import NoRecordFound from './NoRecordFound';
import IntlMessages from '@jumbo/utils/IntlMessages';

const CartasModule = () => {
  const { authUser } = useSelector(({ auth }) => auth);
  const classes = useStyles();
  const {cartas } = useSelector(({ cartasReducer }) => cartasReducer);
  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openCartaDialog, setOpenCartaDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedCarta, setSelectedCarta] = useState({
    name: '',
  });
  const [cartasFetched, setCartasFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getCartas(authUser.empresaCodigo, authUser.rutEmpresa, filterOptions, debouncedSearchTerm, null, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setCartasFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);

  const handleCloseCartaDialog = () => {
    setOpenCartaDialog(false);
    dispatch(setCurrentCarta(null));
    dispatch(setProductosOrdenCompra([]));
    dispatch(setCategoryManagers([]));
    //console.log('');
    dispatch(
      getCartas(authUser.empresaCodigo, authUser.rutEmpresa,filterOptions, debouncedSearchTerm, null, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setCartasFetched(true);
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
      const newSelected = cartas.map(n => n.idCarta);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (event, idCarta) => {
    const selectedIndex = selected.indexOf(idCarta);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, idCarta);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCartaView = carta => {
    dispatch(setCurrentCarta(carta));
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    dispatch(setCurrentCarta(null));
  };

  const handleCartaEdit = carta => {
    dispatch(setCurrentCarta(carta));
    setOpenCartaDialog(true);
  };

  const handleCartaDelete = carta => {
    setSelectedCarta(carta);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);

    dispatch(deleteCarta(selectedCarta.ccvId));
    dispatch(
      getCartas(filterOptions, debouncedSearchTerm, null, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setCartasFetched(true);
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
        <CartaTableToolbar
          selected={selected}
          setSelected={setSelected}
          onCartaAdd={setOpenCartaDialog}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <TableContainer className={classes.container}>
          <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
            <CartaTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={cartas.length}
            />
            <TableBody>
              {!!cartas.length ? (
                stableSort(cartas, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <CartaListRow
                      key={index}
                      row={row}
                      onRowClick={handleRowClick}
                      onCartaEdit={handleCartaEdit}
                      onCartaDelete={handleCartaDelete}
                      onCartaView={handleCartaView}
                      isSelected={isSelected}
                    />
                  ))
              ) : (
                <TableRow style={{ height: 53 * 6 }}>
                  <TableCell colSpan={7} rowSpan={10}>
                    {isFilterApplied ? (
                      <NoRecordFound>{<IntlMessages id="cartas.appModule.filterNoRecordsFound" />}</NoRecordFound>
                    ) : (
                      <NoRecordFound>
                        {cartasFetched ? (
                          <IntlMessages id="cartas.appModule.noRecordsFound" />
                        ) : (
                          <IntlMessages id="cartas.appModule.loadingCartas" />
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
          count={cartas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {openCartaDialog && <AddEditCarta open={openCartaDialog} onCloseDialog={handleCloseCartaDialog} />}
      {openViewDialog && <CartaDetailView open={openViewDialog} onCloseDialog={handleCloseViewDialog} />}

      <ConfirmDialog
        open={openConfirmDialog}
        title={<IntlMessages id="cartas.appModule.deleteConfirm"  />}
        content={<IntlMessages id="cartas.appModule.deleteMessage" values = {{code:selectedCarta.ccvId}}  />}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CartasModule;
