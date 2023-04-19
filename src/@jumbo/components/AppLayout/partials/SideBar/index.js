import React from 'react';
import { useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import makeStyles from '@material-ui/core/styles/makeStyles';

import CmtVertical from '../../../../../@coremat/CmtNavigation/Vertical';
import { sidebarNavs, sidebarNavsUserRolesAplications,sidebarNavsDefault,sidebarNavsProveedor, sidebarNavsCategoryManager } from '../menus';

const useStyles = makeStyles(() => ({
  perfectScrollbarSidebar: {
    height: '100%',
    transition: 'all 0.3s ease',
    '.Cmt-sidebar-fixed &, .Cmt-Drawer-container &': {
      height: 'calc(100% - 167px)',
    },
    '.Cmt-modernLayout &': {
      height: 'calc(100% - 72px)',
    },
    '.Cmt-miniLayout &': {
      height: 'calc(100% - 91px)',
    },
    '.Cmt-miniLayout .Cmt-sidebar-content:hover &': {
      height: 'calc(100% - 167px)',
    },
  },
}));

const SideBar = () => {
  const classes = useStyles();

  const { authUser } = useSelector(({ auth }) => auth);
  const sideBar = sidebarNavsUserRolesAplications(authUser);
  
 /*  FUNCIONANDO CORRECTAMENTE COMENTADO PARA AGREGAR LAS APLICACIONES EN MENU
   const { authUser } = useSelector(({ auth }) => auth);

  for (let i = 0; i < authUser.roles.length; i++) {
    switch (authUser.roles[i].usrlRolCodigo) { 
      case 'AD': { // ADMIN
        return (
          <PerfectScrollbar className={classes.perfectScrollbarSidebar}>
            <CmtVertical menuItems={sidebarNavs} />
          </PerfectScrollbar>
        );
      }
      case 'PR': { // PROVEEDOR
        return (
          <PerfectScrollbar className={classes.perfectScrollbarSidebar}>
            <CmtVertical menuItems={sidebarNavsProveedor} />
          </PerfectScrollbar>
        );
      }
      case 'CAT': { // CATEGORY MANAGER
        return (
          <PerfectScrollbar className={classes.perfectScrollbarSidebar}>
            <CmtVertical menuItems={sidebarNavsCategoryManager} />
          </PerfectScrollbar>
        );
      }
      default:
        return (
          <PerfectScrollbar className={classes.perfectScrollbarSidebar}>
            <CmtVertical menuItems={sidebarNavsDefault} />
          </PerfectScrollbar>
        );

    }

  }    */

   return (
    <PerfectScrollbar className={classes.perfectScrollbarSidebar}>
       {/*<CmtVertical menuItems={sidebarNavs} /> */}
        <CmtVertical menuItems={sideBar} /> 
      
    </PerfectScrollbar>
  ); 
};

export default SideBar;
