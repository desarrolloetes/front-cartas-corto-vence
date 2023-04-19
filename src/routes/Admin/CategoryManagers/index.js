import React, { useEffect, useState } from 'react';
import { Paper, Table, TableCell, TableContainer, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import CategoryManagerListRow from './CategoryManagerListRow';
import CategoryManagerTableHead from './CategoryManagerTableHead';
import CategoryManagerTableToolbar from './CategoryManagerTableToolbar';
import CategoryManagerDetailView from './CategoryManagerDetailView';
import CategoryManagerProveedores from './CategoryManagerProveedores';
import { getComparator, stableSort } from '../../../@jumbo/utils/tableHelper';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteUser,
  setCurrentUser,
} from '../../../redux/actions/Users';

import {
  getAllCategoryManagers,
  setCurrentProveedoresCategoryManager
} from '../../../redux/actions/CategoryManagers';

import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import NoRecordFound from './NoRecordFound';
import IntlMessages from '@jumbo/utils/IntlMessages';

const CategoryManagersModule = () => {
  const classes = useStyles();
  const { categoryManagers } = useSelector(({ categoryManagersReducer }) => categoryManagersReducer);
  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ name: '' });
  const [categoryManagersFetched, setCategoryManagersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [empresaCodigo, SetEmpresaCodigo] = React.useState('');

  const [openCategoryManagerProveedoresDialog, setOpenCategoryManagerProveedoresDialog] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getAllCategoryManagers(empresaCodigo, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setCategoryManagersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    dispatch(setCurrentUser(null));
    dispatch(setCurrentProveedoresCategoryManager([]));
    dispatch(

      getAllCategoryManagers(empresaCodigo, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setCategoryManagersFetched(true);
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
      const newSelected = categoryManagers.map(n => n.userId);
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

  const handleUserView = user => {
    dispatch(setCurrentUser(user));
    setOpenViewDialog(true);
  };

  const handleCategoryManagerProveedoresView = user => {
    dispatch(setCurrentUser(user));
    setOpenCategoryManagerProveedoresDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    dispatch(setCurrentUser(null));
    dispatch(setCurrentProveedoresCategoryManager([]));

  };

  const handleCloseCategoryManagerProveedoresDialog = () => {
    setOpenCategoryManagerProveedoresDialog(false);
    dispatch(setCurrentUser(null));
    dispatch(setCurrentProveedoresCategoryManager([]));
  };

  const handleUserEdit = user => {
    dispatch(setCurrentUser(user));
    setOpenUserDialog(true);
  };

  const handleUserDelete = user => {
    setSelectedUser(user);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);
    dispatch(deleteUser(selectedUser.id));
    dispatch(
      getAllCategoryManagers(filterOptions, debouncedSearchTerm, () => {
        //setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setCategoryManagersFetched(true);
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
        <CategoryManagerTableToolbar
          selected={selected}
          setSelected={setSelected}
          onUserAdd={setOpenUserDialog}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <TableContainer className={classes.container}>
          <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
            <CategoryManagerTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={categoryManagers.length}
            />
            <TableBody>
              {!!categoryManagers.length ? (
                stableSort(categoryManagers, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <CategoryManagerListRow
                      key={index}
                      row={row}
                      onRowClick={handleRowClick}
                      //onUserEdit={handleUserEdit}
                      onUserDelete={handleUserDelete}
                      //onUserView={handleUserView}
                      onUserCategoryManagerProveedores={handleCategoryManagerProveedoresView}
                      isSelected={isSelected}
                    />
                  ))
              ) : (
                <TableRow style={{ height: 53 * 6 }}>
                  <TableCell colSpan={7} rowSpan={10}>
                    {isFilterApplied ? (
                      <NoRecordFound>{<IntlMessages id="categoryManagers.appModule.filterNoRecordsFound" />}</NoRecordFound>
                    ) : (
                      <NoRecordFound>
                        {categoryManagersFetched ? (
                          <IntlMessages id="categoryManagers.appModule.noRecordsFound" />
                        ) : (
                          <IntlMessages id="categoryManagers.appModule.loadingUsers" />
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
          count={categoryManagers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {openCategoryManagerProveedoresDialog && <CategoryManagerProveedores open={openCategoryManagerProveedoresDialog} onCloseDialog={handleCloseCategoryManagerProveedoresDialog} />}

      <ConfirmDialog
        open={openConfirmDialog}
        title={<IntlMessages id="categoryManagers.appModule.deleteConfirm" />}
        content={<IntlMessages id="categoryManagers.appModule.deleteMessage" values={{ code: selectedUser.id }} />}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CategoryManagersModule;
