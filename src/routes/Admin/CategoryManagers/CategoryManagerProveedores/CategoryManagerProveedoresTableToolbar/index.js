import React, { useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import PropTypes from 'prop-types';
import { Button, Chip, Menu, MenuItem } from '@material-ui/core';
import ConfirmDialog from '../../../../../@jumbo/components/Common/ConfirmDialog';
import CmtSearch from '../../../../../@coremat/CmtSearch';
import useStyles from './index.style';
import Checkbox from '@material-ui/core/Checkbox';
import IntlMessages from '@jumbo/utils/IntlMessages';

const filterOptionsList = [

  {
    label: <IntlMessages id="proveedores.appModule.proveedorCategoryManagersAssignment.filterActive" />,
    value: 'S',
  },
  {
    label: <IntlMessages id="proveedores.appModule.proveedorCategoryManagersAssignment.filterInactive" />,
    value: 'N',
  },
];

const CategoryManagerProveedoresTableToolbar = ({
  //selected,
  //setSelected,
  onUserAdd,
  filterOptions,
  setFilterOptions,
  searchTerm,
  setSearchTerm,
}) => {
  const classes = useStyles();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const onFilterOptionClick = option => {
    setFilterOptions(prevState => {
      if (prevState.includes(option.value)) {
        return prevState.filter(item => item !== option.value);
      } else {
        return [...prevState, option.value];
      }
    });
  };

  const onChipDelete = option => {
    setFilterOptions(filterOptions.filter(item => item !== option.value));
  };

  const onSearchChipDelete = () => setSearchTerm('');

  return (
    <React.Fragment>
      <Toolbar>
        <Typography className={classes.title} variant="h4" id="tableTitle" component="div">
          {<IntlMessages id="proveedores.categoryManagerProveedoresAssignment.label.proveedores" />}{' '}
          <Button color="primary">
          </Button>
        </Typography>
        <React.Fragment>
          <CmtSearch onChange={e => setSearchTerm(e.target.value)} value={searchTerm} border={false} onlyIcon />
          <div className={classes.chipsRoot}>
            {searchTerm && <Chip label={searchTerm} onDelete={onSearchChipDelete} />}
            {filterOptionsList.map(
              (option, index) =>
                filterOptions.includes(option.value) && (
                  <Chip key={index} label={option.label} onDelete={() => onChipDelete(option)} />
                ),
            )}
          </div>
          <Tooltip title={<IntlMessages id="proveedores.appModule.proveedorCategoryManagersAssignment.filterList" />}>
            <IconButton aria-label="filter list" onClick={handleClick}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Menu
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            {filterOptionsList.map((option, index) => (
              <MenuItem key={index} onClick={() => onFilterOptionClick(option)}>
                <Checkbox checked={filterOptions.includes(option.value)} inputProps={{ 'aria-labelledby': option.label }} />
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
        {/*   )} */}
      </Toolbar>

      <ConfirmDialog
        open={openConfirmDialog}
        title={<IntlMessages id="proveedores.appModule.proveedorCategoryManagersAssignment.confirmDelete" />}
        content={<IntlMessages id="proveedores.appModule.proveedorCategoryManagersAssignment.confirmDeleteContent" />}
        onClose={handleCancelDelete}
      />
    </React.Fragment>
  );
};

CategoryManagerProveedoresTableToolbar.propTypes = {
  //selected: PropTypes.array,
  //setSelected: PropTypes.func,
  filterOptions: PropTypes.array,
  setFilterOptions: PropTypes.func,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  onUserAdd: PropTypes.func,
};

export default React.memo(CategoryManagerProveedoresTableToolbar);
