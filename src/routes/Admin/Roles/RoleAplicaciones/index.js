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
import RoleAplicacionesTableHead from './RoleAplicacionesTableHead';
import RoleAplicacionesTableToolbar from './RoleAplicacionesTableToolbar';
import RoleAplicacionesListRow from './RoleAplicacionesListRow';
import { getComparator, stableSort } from '../../../../@jumbo/utils/tableHelper';
import { Paper, Table, TableCell, TableContainer, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import ConfirmDialog from '../../../../@jumbo/components/Common/ConfirmDialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { fetchError, fetchSuccess } from '../../../../redux/actions';
import { addRolAplicaciones, getAplicacionesByRol } from '../../../../redux/actions/Aplicaciones';


const RoleAplicaciones = ({ open, onCloseDialog }) => {

  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [rolAplicacionesFetched, setRolAplicacionesFetched] = useState(false);
  const [empresaCodigo, setEmpresaCodigo] = useState('');

  const { currentRole } = useSelector(({ rolesReducer }) => rolesReducer);
  const { currentRolAplicaciones } = useSelector(({ aplicacionesReducer }) => aplicacionesReducer);
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
      getAplicacionesByRol(currentRole.rolEmpresaId, currentRole.rolId, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setRolAplicacionesFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm, currentRole.rolId], currentRolAplicaciones);


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = currentRolAplicaciones.map(n => n.rolId);
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

  const { rolCodigo, rolDescripcion, rolEstado, rolId, rolEmpresaId, profile_pic } = currentRole;
  const empresa = currentRole.empresa.empresaNombre;

  const isSelected = (id) => {
    return selected.indexOf(id) !== -1;
  }


  const handleConfirmCreateAplicaciones = () => {
    let rolAplicaciones = [];
    let obj = {};
    for (let i = 0; i < selected.length; i++) {
      obj = {};
      //obj['roaId']=currentRole.id;
      obj['roaEmpId'] = currentRole.rolEmpresaId;
      obj['roaAppId'] = selected[i];
      obj['roaRolId'] = currentRole.rolId;
      obj['roaTipoOperador'] = 'L';
      obj['roaVigencia'] = 'S';
      rolAplicaciones.push(obj);
    }

    dispatch(
      addRolAplicaciones(currentRole.rolEmpresaId, rolAplicaciones, () => {
      }),
    );

    dispatch(

      getAplicacionesByRol(currentRole.rolEmpresaId, currentRole.rolId, filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setRolAplicacionesFetched(true);
      }),

    );

    handleCancelCreateAplicaciones();
    setTimeout(() => { dispatch(fetchSuccess(<IntlMessages id="roles.fetch.delete.aplicacionAssignment.message" />)); }, 2000);

    onCloseDialog();

  };

  const handleCancelCreateAplicaciones = () => {
    setOpenConfirmDialog(false);
  };

  const onSubmitClick = () => {
    if (selected.length === 0) {
      dispatch(fetchError(<IntlMessages id="roles.appModule.aplicacionAssignment.emptyAplicaciones" />));
    } else {
      setOpenConfirmDialog(true);
    }
  }


  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}><IntlMessages id="roles.rolAplicaciones.aplicacionAssignment.form.editTitle" /></DialogTitle>
      <DialogContent dividers>
        <Box className={classes.userInfoRoot}>
          <Box mr={3} display="flex" alignItems="center">
            <Box className={classes.avatarView} mr={{ xs: 4, md: 6 }}>
              <CmtAvatar size={70} src={profile_pic} alt={rolCodigo + ' ' + rolDescripcion} />
            </Box>
            <Box mt={-2}>
              <Box display="flex" alignItems="center">
                <Typography className={classes.titleRoot}>{`${rolCodigo} ${rolDescripcion} `}</Typography>
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
          <RoleAplicacionesTableToolbar
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <TableContainer className={classes.container}>
            <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
              <RoleAplicacionesTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={currentRolAplicaciones.length}
              />
              <TableBody>
                {!!currentRolAplicaciones.length ? (
                  stableSort(currentRolAplicaciones, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <RoleAplicacionesListRow
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
                        <NoRecordFound>{<IntlMessages id="roles.appModule.filterNoRecordsFound" />}</NoRecordFound>
                      ) : (
                        <NoRecordFound>
                          {rolAplicacionesFetched ? (
                            <IntlMessages id="roles.rolAplicaciones.label.noRecordsFound" />
                          ) : (
                            <IntlMessages id="roles.rolAplicaciones.label.loadingAplicaciones" />
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
            count={currentRolAplicaciones.length}
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
          title={<IntlMessages id="roles.appModule.aplicacionAssignment.createConfirm" />}
          content={<IntlMessages id="roles.appModule.aplicacionAssignment.createMessage" />}
          onClose={handleCancelCreateAplicaciones}
          onConfirm={handleConfirmCreateAplicaciones}
        />

      </DialogContent>
    </Dialog>
  );
};

export default RoleAplicaciones;

RoleAplicaciones.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
