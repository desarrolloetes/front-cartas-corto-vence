import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import CmtAvatar from '../../../../@coremat/CmtAvatar';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import useStyles from './index.style';
import IntlMessages from '../../../../@jumbo/utils/IntlMessages';
import { useDebounce } from '../../../../@jumbo/utils/commonHelper';
import TablePagination from '@material-ui/core/TablePagination';
import NoRecordFound from '../NoRecordFound';
import ProveedorCategoryManagersTableHead from './ProveedorCategoryManagersTableHead';
import ProveedorCategoryManagersTableToolbar from './ProveedorCategoryManagersTableToolbar';
import ProveedorCategoryManagersListRow from './ProveedorCategoryManagersListRow';
import { getComparator, stableSort } from '../../../../@jumbo/utils/tableHelper';
import { Paper, Table, TableCell, TableContainer, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import ConfirmDialog from '../../../../@jumbo/components/Common/ConfirmDialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { fetchError, fetchSuccess } from '../../../../redux/actions';
import { addProveedorCategoryManagers, getCategoryManagersByProveedorRut } from '../../../../redux/actions/Proveedores';


const ProveedorCategoryManagers = ({ open, onCloseDialog }) => {

  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [proveedorCategoryManagersFetched, setRolAplicacionesFetched] = useState(false);
  const [empresaCodigo, setEmpresaCodigo] = useState('');

  const { currentProveedor } = useSelector(({ proveedoresReducer }) => proveedoresReducer);
  const { currentProveedorCategoryManagers } = useSelector(({ proveedoresReducer }) => proveedoresReducer);
  const classes = useStyles();
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [selected, setSelected] = React.useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    dispatch(
      getCategoryManagersByProveedorRut(currentProveedor.provEmpresaId, currentProveedor.provRut, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setRolAplicacionesFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm, currentProveedor.provRut], currentProveedorCategoryManagers);


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = currentProveedorCategoryManagers.map(n => n.provId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };


  const handleRowClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
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
    setSelected(newSelected);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const { provProveedor, provId, provEmpresaId, profile_pic } = currentProveedor;
  const empresa = currentProveedor.empresa.empresaNombre;

  const isSelected = (id) => {
    return selected.indexOf(id) !== -1;
  }


  const handleConfirmCreateProveedorCategoryManagers = () => {
    let proveedorCategoryManagers = [];
    let obj = {};
    for (let i = 0; i < selected.length; i++) {
      obj = {};
      //obj['roaId']=currentProveedor.id;
      obj['ctpEmpresaId'] = currentProveedor.rolEmpresaId;
      obj['ctpCodigoCm'] = selected[i];
      obj['ctpPrvRut'] = currentProveedor.provRut;
      obj['ctpEstado'] = 'S';
      proveedorCategoryManagers.push(obj);
    }

    dispatch(
      addProveedorCategoryManagers(currentProveedor.provEmpresaId, proveedorCategoryManagers, () => {
      }),
    );

    dispatch(

      getCategoryManagersByProveedorRut(currentProveedor.provEmpresaId, currentProveedor.provRut, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setRolAplicacionesFetched(true);
      }),

    );

    handleCancelCreateProveedorCategoryManagers();
    //dispatch(setCurrentUserRoles([]));
    setTimeout(() => { dispatch(fetchSuccess(<IntlMessages id="proveedores.fetch.delete.proveedorCategoryManagersAssignment.message" />)); }, 2000);

    onCloseDialog();

  };

  const handleCancelCreateProveedorCategoryManagers = () => {
    setOpenConfirmDialog(false);
    //setCurrentUserRoles([]);
  };

  const onSubmitClick = () => {
    if (selected.length === 0) {
      dispatch(fetchError(<IntlMessages id="proveedores.appModule.proveedorCategoryManagersAssignment.emptyCategoryManager" />));
    } else {
      setOpenConfirmDialog(true);
    }
  }


  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}><IntlMessages id="proveedores.proveedorCategoryManagers.proveedorCategoryManagersAssignment.form.editTitle" /></DialogTitle>
      <DialogContent dividers>
        <Box className={classes.userInfoRoot}>
          <Box mr={3} display="flex" alignItems="center">
            <Box className={classes.avatarView} mr={{ xs: 4, md: 6 }}>
              <CmtAvatar size={70} src={profile_pic} alt={provProveedor} />
            </Box>
            <Box mt={-2}>
              <Box display="flex" alignItems="center">
                <Typography className={classes.titleRoot}>{`${provProveedor} `}</Typography>
              </Box>
              {(empresa) && (
                <Box mt={-1}>
                  {empresa && <Typography className={classes.subTitleRoot}>{empresa}</Typography>}
                  {empresa && <Typography className={classes.subTitleRoot}>@{empresa}</Typography>}

                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Paper className={classes.paper}>
          <ProveedorCategoryManagersTableToolbar
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <TableContainer className={classes.container}>
            <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
              <ProveedorCategoryManagersTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={currentProveedorCategoryManagers.length}
              />
              <TableBody>
                {!!currentProveedorCategoryManagers.length ? (
                  stableSort(currentProveedorCategoryManagers, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <ProveedorCategoryManagersListRow
                        key={index}
                        row={row}
                        onRowClick={handleRowClick}
                        isSelected={isSelected}
                      />
                    ))
                ) : (
                  <TableRow style={{ height: 53 * 6 }}>
                    <TableCell colSpan={7} rowSpan={10}>
                      {isFilterApplied ? (
                        <NoRecordFound>{<IntlMessages id="proveedores.appModule.proveedorCategoryManagers.filterNoRecordsFound" />}</NoRecordFound>
                      ) : (
                        <NoRecordFound>
                          {proveedorCategoryManagersFetched ? (
                            <IntlMessages id="proveedores.proveedorCategoryManagers.label.noRecordsFound" />
                          ) : (
                            <IntlMessages id="proveedores.proveedorCategoryManagers.label.loadingCategoryManagers" />
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
            count={currentProveedorCategoryManagers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />

        </Paper>
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button onClick={onCloseDialog}>Cancel</Button>
          <Box ml={2}>
            <Button variant="contained" color="primary" onClick={onSubmitClick}>
              Save
            </Button>
          </Box>
        </Box>

        <ConfirmDialog
          open={openConfirmDialog}
          title={<IntlMessages id="proveedores.appModule.proveedorCategoryManagersAssignment.createConfirm" />}
          content={<IntlMessages id="proveedores.appModule.proveedorCategoryManagersAssignment.createMessage" />}
          onClose={handleCancelCreateProveedorCategoryManagers}
          onConfirm={handleConfirmCreateProveedorCategoryManagers}
        />

      </DialogContent>
    </Dialog>
  );
};

export default ProveedorCategoryManagers;

ProveedorCategoryManagers.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
