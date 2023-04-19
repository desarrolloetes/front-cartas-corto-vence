import React , { useEffect, useState }from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import CmtAvatar from '../../../../@coremat/CmtAvatar';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
//import Checkbox from '@material-ui/core/Checkbox';
//import StarBorderIcon from '@material-ui/icons/StarBorder';
//import StarIcon from '@material-ui/icons/Star';
//import CmtList from '../../../../@coremat/CmtList';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import ClearIcon from '@material-ui/icons/Clear';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import HomeIcon from '@material-ui/icons/Home';
import PhoneIcon from '@material-ui/icons/Phone';
import WcIcon from '@material-ui/icons/Wc';

import useStyles from './index.style';
import { Block, CheckCircleOutline } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import UserRolesTableHead from './UserRolesTableHead';
import UserRolesListRow from './UserRolesListRow';
import UserRolesAplicationsTableHead from './UserRolesAplicationsTableHead';
import UserRolesAplicationsListRow from './UserRolesAplicationsListRow';
import { Paper, Table, TableCell, TableContainer, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import { getComparator, stableSort } from '../../../../@jumbo/utils/tableHelper';
import NoRecordFound from '../NoRecordFound';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

//import DialogContent from '@material-ui/core/DialogContent';
//import GridContainer from '../../../../@jumbo/components/GridContainer';
//import Grid from '@material-ui/core/Grid';
//import AppTextInput from '../../../../@jumbo/components/Common/formElements/AppTextInput';
import IntlMessages from '../../../../@jumbo/utils/IntlMessages';
//import AppSelectBox from '../../../../@jumbo/components/Common/formElements/AppSelectBox';
//import Button from '@material-ui/core/Button';
//import { useDropzone } from 'react-dropzone';
//import { useState } from 'react';

import { getUserRoles, getUserApplications } from '../../../../redux/actions/Users';

/* const labels = [
  { title: 'Masculino', slug: 'M' },
  { title: 'Femenino', slug: 'F' },
  { title: 'Otro', slug: 'O' },
]; */

/* const statusLabels = [
  { title: 'Activo', slug: 'S' },
  { title: 'Inactivo', slug: 'N' },
]; */




const UserDetailView = ({ open, onCloseDialog }) => {

  const classes = useStyles();
  const { currentUser, currentUserRoles, currentUserApplications } = useSelector(({ usersReducer }) => usersReducer);

  const { login, rutEmpresa, nombres, apellidoM, apellidoP, email, empresaId, estado, profile_pic } = currentUser;
  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [userRolesFetched, setUserRolesFetched] = useState(false);
  const [userAplicationsFetched, setUserAplicationsFetched] = useState(false);
  const [pageRol, setPageRol] = React.useState(0);
  const [rowsPerPageRol, setRowsPerPageRol] = React.useState(10);

  const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(
        getUserRoles(currentUser.empresaId, currentUser.login, ['S'], '', () => {
          //setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
          setUserRolesFetched(true);
        }),
        );
      dispatch(
        getUserApplications(currentUser.empresaId, currentUser.login, [], '', () => {
          //setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
          setUserAplicationsFetched(true);
        }),
      );
    }, []);
   

    const handlePageChange = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleRowsPerPageChange = event => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handlePageRolChange = (event, newPage) => {
      setPageRol(newPage);
    };
  
    const handleRowsPerPageRolChange = event => {
      setRowsPerPageRol(parseInt(event.target.value, 10));
      setPage(0);
    };
      
  

  const isSelected = id => selected.indexOf(id) !== -1;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          <Box className={classes.avatarView} mr={{ xs: 4, md: 6 }}>
            <CmtAvatar size={70} src={profile_pic} alt={nombres} />
          </Box>
          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{`${nombres ?  nombres : ''} ${apellidoP ?  apellidoP : ''} ${apellidoM ?  apellidoM : ''}`}</Typography>
              {/*               <Box ml={1}>
                <Checkbox
                  icon={<StarBorderIcon />}
                  checkedIcon={<StarIcon style={{ color: '#FF8C00' }} />}
                  checked={userFirstName}
                />
              </Box> */}
            </Box>
            {(empresaId) && (
              <Box mt={-1}>
                {empresaId && <Typography className={classes.subTitleRoot}>{empresaId}</Typography>}
              </Box>
            )}
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
          <Box ml={1}>
            <Tooltip title={estado}>
              <IconButton aria-label="filter list">
                {estado === 1 && <Block color="primary" />}
                {estado === 0 && <CheckCircleOutline color="primary" />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box ml={1}>
            <IconButton onClick={onCloseDialog}>
              <ClearIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box px={6} py={5}>
        <Box mb={5} component="p" color="common.dark">
          {<IntlMessages id="users.userDetailview.label.title" />}
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <FingerprintIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {login}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <AccountCircleIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {`${nombres ?  nombres : ''} ${apellidoP ?  apellidoP : ''} ${apellidoM ?  apellidoM : ''}` }
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          <EmailIcon />
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {email}
          </Box>
        </Box>
      </Box>
      
      <Box px={6} py={5}>
        <Box mb={5} component="p" color="common.dark">
          {<IntlMessages id="users.userDetailview.label.rolesTitle" />}
        </Box>

        <Paper className={classes.paper}>
        <Card className={classes.root}>
        <CardContent>        
          <TableContainer className={classes.container}>
            <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
              <UserRolesTableHead
                classes={classes}
                //numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                //onSelectAllClick={handleSelectAllClick}
                //onRequestSort={handleRequestSort}
                rowCount={currentUserRoles.length}
              />
              <TableBody>
                {!!currentUserRoles.length ? (
                  stableSort(currentUserRoles, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <UserRolesListRow
                        key={index}
                        row={row}
                        //onRowClick={handleRowClick}
                        //onUserEdit={handleUserEdit}
                        //onUserDelete={handleUserDelete}
                        //onUserView={handleUserView}
                        //onUserRoles={handleUserRolesView}
                        isSelected={isSelected}
                      />
                    ))
                ) : (
                  <TableRow style={{ height: 53 * 6 }}>
                    <TableCell colSpan={7} rowSpan={10}>
                      {isFilterApplied ? (
                        <NoRecordFound>{<IntlMessages id="users.appModule.filterNoRecordsFound" />}</NoRecordFound>
                      ) : (
                        <NoRecordFound>
                          {userRolesFetched ? (
                            <IntlMessages id="users.userRoles.label.noRecordsFound" />
                          ) : (
                            <IntlMessages id="users.userRoles.label.loadingUsers" />
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
          count={currentUserRoles.length}
          rowsPerPage={rowsPerPageRol}
          page={pageRol}
          onPageChange={handlePageRolChange}
          onRowsPerPageChange={handleRowsPerPageRolChange}
        />          
          </CardContent>  
          </Card>
        </Paper>
      </Box>
      <Box px={6} py={5}>
      <Box mb={5} component="p" color="common.dark">
          {<IntlMessages id="users.userDetailview.label.aplicacionesTitle" />}
        </Box>        
        <Paper className={classes.paper}>
        <Card className={classes.root}>
        <CardContent>   
          <TableContainer className={classes.container}>
            <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
              <UserRolesAplicationsTableHead
                classes={classes}
                //numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                //onSelectAllClick={handleSelectAllClick}
                //onRequestSort={handleRequestSort}
                rowCount={currentUserApplications.length}
              />
              <TableBody>
                {!!currentUserApplications.length ? (
                  stableSort(currentUserApplications, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <UserRolesAplicationsListRow
                        key={index}
                        row={row}
                        //onRowClick={handleRowClick}
                        //onUserEdit={handleUserEdit}
                        //onUserDelete={handleUserDelete}
                        //onUserView={handleUserView}
                        //onUserRoles={handleUserRolesView}
                        isSelected={isSelected}
                      />
                    ))
                ) : (
                  <TableRow style={{ height: 53 * 6 }}>
                    <TableCell colSpan={7} rowSpan={10}>
                      {isFilterApplied ? (
                        <NoRecordFound>{<IntlMessages id="users.appModule.filterNoRecordsFound" />}</NoRecordFound>
                      ) : (
                        <NoRecordFound>
                          {userAplicationsFetched ? (
                            <IntlMessages id="users.userRoles.label.noRecordsFound" />
                          ) : (
                            <IntlMessages id="users.userAplications.label.loadingAplications" />
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
          count={currentUserApplications.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />            
          </CardContent>
          </Card>
        </Paper>
      </Box>      
    </Dialog>
  );
};

export default UserDetailView;

UserDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
