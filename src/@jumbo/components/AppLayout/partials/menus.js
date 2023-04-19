import React from 'react';
import { useSelector } from 'react-redux';
import { PostAdd } from '@material-ui/icons';
import IntlMessages from '../../../utils/IntlMessages';
import {
  Settings,
  Person,
  Edit,
  EditAttributes,
  Search,
  House,
  CloudUpload,
  Inbox,
  AddToHomeScreen,
  Folder,
  LibraryBooks,
  Functions,
  Grain,
  PieChart,
  LibraryAdd,
  HomeWork,
} from '@material-ui/icons';

const homeMenu = {
  name: <IntlMessages id={'sidebar.appModule.homePage'} />,
  icon: <HomeWork />,
  link: '/',
};

const adminMenu = {
  name: <IntlMessages id={'sidebar.appModule.admin'} />,
  icon: <Settings />,
  type: 'collapse',
  children: [
    {
      name: <IntlMessages id={'sidebar.appModule.admin.users'} />,
      icon: <Person />,
      type: 'item',
      link: '/admin/users',
    },
    {
      name: <IntlMessages id={'sidebar.appModule.admin.applications'} />,
      icon: <EditAttributes />,
      type: 'item',
      link: '/admin/aplicaciones',
    },  
    {
      name: <IntlMessages id={'sidebar.appModule.admin.roles'} />,
      icon: <EditAttributes />,
      type: 'item',
      link: '/admin/roles',
    }, 
    {
      name: <IntlMessages id={'sidebar.appModule.admin.proveedores'} />,
      icon: <EditAttributes />,
      type: 'item',
      link: '/admin/proveedores',
    },               
    {
      name: <IntlMessages id={'sidebar.appModule.admin.category'} />,
      icon: <EditAttributes />,
      type: 'item',
      link: '/admin/categoryManagers',
    },    
     ],
};

const provedorMenu = {
  name: <IntlMessages id={'sidebar.appModule.proveedorCartas'} />,
  icon: <Edit />,
  type: 'collapse',
  children: [
    {
      name: <IntlMessages id={'sidebar.appModule.cartas.cartas'} />,
      icon: <Edit />,
      type: 'item',
      link: '/applications/cartas',
    },   
    {
      name: <IntlMessages id={'sidebar.appModule.cartas.buscador'} />,
      icon: <Search />,
      type: 'item',
      link: '/applications/buscarCartas',
    },
  ],
};

const categoryManagerMenu = {
  name: <IntlMessages id={'sidebar.appModule.categoryManagerCartas'} />,
  icon: <Edit />,
  type: 'collapse',
  children: [
    {
      name: <IntlMessages id={'sidebar.appModule.cartas.validar'} />,
      icon: <House />,
      type: 'item',
      link: '/applications/validarCartas',
    },     
  ],
};

const agendamientoMenu = {
  name: <IntlMessages id={'sidebar.appModule.agendamiento'} />,
  icon: <Edit />,
  type: 'collapse',
  children: [
   {
      name: <IntlMessages id={'sidebar.appModule.agendamiento.agendamiento'} />,
      icon: <House />,
      type: 'item',
      link: '/applications/agendamiento',
    },
  ],
};


const reportsMenu = {
  name: <IntlMessages id={'sidebar.appModule.reports'} />,
  icon: <Inbox />,
  type: 'collapse',
  children: [
    {
      name: <IntlMessages id={'sidebar.appModule.reports.agendamiento'} />,
      icon: <AddToHomeScreen />,
      type: 'item',
      link: '/reports/agendamiento',
    },
    {
      name: <IntlMessages id={'sidebar.appModule.reports.proveedores'} />,
      icon: <House />,
      type: 'item',
      link: '/reports/proveedores',
    },
  ],
};

  export const sidebarNavs = [
  {
    name: <IntlMessages id={'sidebar.modules'} />,
    type: 'section',
   // children: [homeMenu, adminMenu, cartasCortoVenceMenu, agendamientoMenu,reportsMenu],
   children: [homeMenu, adminMenu, provedorMenu, categoryManagerMenu],
  },
]; 

export const sidebarNavsDefault = [
  {
    name: <IntlMessages id={'sidebar.modules'} />,
    type: 'section',
   // children: [homeMenu, adminMenu, cartasCortoVenceMenu, agendamientoMenu,reportsMenu],
   children: [homeMenu],
  },
]; 
 
export const sidebarNavsProveedor = [
  {
    name: <IntlMessages id={'sidebar.modules'} />,
    type: 'section',
   // children: [homeMenu, adminMenu, cartasCortoVenceMenu, agendamientoMenu,reportsMenu],
   children: [homeMenu, provedorMenu],
  },
]; 

export const sidebarNavsCategoryManager = [
  {
    name: <IntlMessages id={'sidebar.modules'} />,
    type: 'section',
   // children: [homeMenu, adminMenu, cartasCortoVenceMenu, agendamientoMenu,reportsMenu],
   children: [homeMenu, categoryManagerMenu],
  },
]; 

export const horizontalDefaultNavs = [
  {
    name: <IntlMessages id={'sidebar.main'} />,
    type: 'collapse',
    children: [
      {
        name: <IntlMessages id={'pages.samplePage'} />,
        type: 'item',
        icon: <PostAdd />,
        link: '/sample-page',
      },
    ],
  },
];

export const minimalHorizontalMenus = [
  {
    name: <IntlMessages id={'sidebar.main'} />,
    type: 'collapse',
    children: [
      {
        name: <IntlMessages id={'pages.samplePage'} />,
        type: 'item',
        icon: <PostAdd />,
        link: '/sample-page',
      },
    ],
  },
];


export const sidebarNavsUserRolesAplications = (authUser) => {
 // const { authUser } = useSelector(({ auth }) => auth);
  const childrenSidebarNavs = [];
  childrenSidebarNavs.push(homeMenu);

  for (let i = 0; i < authUser.roles.length; i++) {
    switch (authUser.roles[i].usrlRolCodigo) { 
      case 'AD': { // ADMIN
        childrenSidebarNavs.push(adminMenu);
        break;
      }
      case 'PR': { // PROVEEDOR
        childrenSidebarNavs.push(provedorMenu);
        break;
      }
      case 'CM': { // CATEGORY MANAGER
        childrenSidebarNavs.push(categoryManagerMenu);
        break;
      }
    }

  } 
  return ([
    {
      name: <IntlMessages id={'sidebar.modules'} />,
      type: 'section',
      children:childrenSidebarNavs,
     // children: [homeMenu, adminMenu, provedorMenu, categoryManagerMenu],
    },
  ])
}
