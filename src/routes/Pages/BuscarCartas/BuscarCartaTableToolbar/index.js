import React, { useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import PropTypes from 'prop-types';
import { Button, Chip, Menu, MenuItem } from '@material-ui/core';
import ConfirmDialog from '../../../../@jumbo/components/Common/ConfirmDialog';
import CmtSearch from '../../../../@coremat/CmtSearch';
import useStyles from './index.style';
import Checkbox from '@material-ui/core/Checkbox';
import IntlMessages from '@jumbo/utils/IntlMessages';

const filterOptionsList = [
  {
    label: <IntlMessages id="cartas.appModule.filterRecepcionada" />,
    value: 1,
  },
  {
    label: <IntlMessages id="cartas.appModule.filterAprobada" />,
    value: 2,
  },
  {
    label: <IntlMessages id="cartas.appModule.filterRechazada" />,
    value: 3,
  },
  {
    label: <IntlMessages id="cartas.appModule.filterAprobadaParcial" />,
    value: 4,
  },    
];

const ValidarCartaTableToolbar = ({
  selected,
  setSelected,
  onCartaAdd,
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

  const onDeleteCLick = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);
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

  const numSelected = selected.length;

  return (
    <React.Fragment>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}>
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {numSelected}{' '}
            {numSelected > 1 ? (
              <IntlMessages id="cartas.appModule.selectedCartas" />
            ) : (
              <IntlMessages id="cartas.appModule.selectedCarta" />
            )}
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h4" id="tableTitle" component="div">
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title={<IntlMessages id="cartas.appModule.deleteCarta" />}>
            <IconButton aria-label="delete" onClick={onDeleteCLick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
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
            <Tooltip title={<IntlMessages id="cartas.appModule.filterList" />}>
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
                  <Checkbox
                    checked={filterOptions.includes(option.value)}
                    inputProps={{ 'aria-labelledby': option.label }}
                  />
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </React.Fragment>
        )}
      </Toolbar>

      <ConfirmDialog
        open={openConfirmDialog}
        title={<IntlMessages id="cartas.appModule.confirmDelete" />}
        content={<IntlMessages id="cartas.appModule.confirmDeleteContent" />}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </React.Fragment>
  );
};

ValidarCartaTableToolbar.propTypes = {
  selected: PropTypes.array,
  setSelected: PropTypes.func,
  filterOptions: PropTypes.array,
  setFilterOptions: PropTypes.func,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  onCartaAdd: PropTypes.func,
};

export default React.memo(ValidarCartaTableToolbar);