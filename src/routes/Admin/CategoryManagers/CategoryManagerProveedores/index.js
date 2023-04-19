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
import CategoryManagerProveedoresTableHead from './CategoryManagerProveedoresTableHead';
import CategoryManagerProveedoresTableToolbar from './CategoryManagerProveedoresTableToolbar';
import CategoryManagerProveedoresListRow from './CategoryManagerProveedoresListRow';
import { getComparator, stableSort } from '../../../../@jumbo/utils/tableHelper';
import { Paper, Table, TableCell, TableContainer, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import ConfirmDialog from '../../../../@jumbo/components/Common/ConfirmDialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { fetchError, fetchSuccess } from '../../../../redux/actions';
import { addProveedorCategoryManagers } from '../../../../redux/actions/Proveedores';
import { getProveedoresByCategoryManagerId } from '../../../../redux/actions/CategoryManagers';


const CategoryManagerProveedores = ({ open, onCloseDialog }) => {

  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [proveedoresCategoryManagerFetched, setProveedoresCategoryManagerFetched] = useState(false);
  const [empresaCodigo, setEmpresaCodigo] = useState('');

  const { currentUser } = useSelector(({ usersReducer }) => usersReducer);
  const { currentProveedoresCategoryManager } = useSelector(({ categoryManagersReducer }) => categoryManagersReducer);
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
      getProveedoresByCategoryManagerId(currentUser.empresaId, currentUser.id, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setProveedoresCategoryManagerFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm, currentUser.id], currentProveedoresCategoryManager);
  // }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = currentProveedoresCategoryManager.map(n => n.id);
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


  //const { nombres, apaterno, amaterno, profile_pic } = currentUser;
  const { nombres, id, empresaId, profile_pic } = currentUser;
  const empresa = currentUser.empresa.empresaNombre;

  const isSelected = (id) => {
    return selected.indexOf(id) !== -1;
  }


  const handleConfirmCreateProveedorCategoryManagers = () => {
    let proveedorCategoryManagers = [];
    let obj = {};
    for (let i = 0; i < selected.length; i++) {
      obj = {};
      //obj['roaId']=currentUser.id;
      obj['ctpEmpresaId'] = currentUser.empresaId;
      obj['ctpCodigoCm'] = currentUser.id;
      obj['ctpPrvRut'] = selected[i];
      obj['ctpEstado'] = 'S';
      proveedorCategoryManagers.push(obj);
    }

    dispatch(
      addProveedorCategoryManagers(currentUser.empresaId, proveedorCategoryManagers, () => {
      }),
    );

    dispatch(

      getProveedoresByCategoryManagerId(currentUser.empresaId, currentUser.id, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setProveedoresCategoryManagerFetched(true);
      }),

    );

    handleCancelCreateProveedorCategoryManagers();

    setTimeout(() => { dispatch(fetchSuccess(<IntlMessages id="proveedores.fetch.delete.categoryManagerProveedoresAssignment.message" />)); }, 2000);

    onCloseDialog();

  };

  const handleCancelCreateProveedorCategoryManagers = () => {
    setOpenConfirmDialog(false);

  };

  const onSubmitClick = () => {
    if (selected.length === 0) {
      dispatch(fetchError(<IntlMessages id="proveedores.appModule.categoryManagerProveedoresAssignment.emptyProveedores" />));
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
              <CmtAvatar size={70} src={profile_pic} alt={nombres} />
            </Box>
            <Box mt={-2}>
              <Box display="flex" alignItems="center">
                <Typography className={classes.titleRoot}>{`${nombres} `}</Typography>
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
          <CategoryManagerProveedoresTableToolbar
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <TableContainer className={classes.container}>
            <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
              <CategoryManagerProveedoresTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={currentProveedoresCategoryManager.length}
              />
              <TableBody>
                {!!currentProveedoresCategoryManager.length ? (
                  stableSort(currentProveedoresCategoryManager, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <CategoryManagerProveedoresListRow
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
                          {proveedoresCategoryManagerFetched ? (
                            <IntlMessages id="proveedores.categoryManagerProveedores.label.noRecordsFound" />
                          ) : (
                            <IntlMessages id="proveedores.categoryManagerProveedores.label.loadingProveedores" />
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
            count={currentProveedoresCategoryManager.length}
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
          title={<IntlMessages id="proveedores.appModule.categoryManagerProveedoresAssignment.createConfirm" />}
          content={<IntlMessages id="proveedores.appModule.categoryManagerProveedoresAssignment.createMessage" />}
          onClose={handleCancelCreateProveedorCategoryManagers}
          onConfirm={handleConfirmCreateProveedorCategoryManagers}
        />

      </DialogContent>
    </Dialog>
  );
};

export default CategoryManagerProveedores;

CategoryManagerProveedores.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
