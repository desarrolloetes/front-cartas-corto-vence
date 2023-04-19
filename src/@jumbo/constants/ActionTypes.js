export const SHOW_MESSAGE = 'show_message';
export const HIDE_MESSAGE = 'hide_message';
export const FETCH_START = 'fetch_start';
export const FETCH_SUCCESS = 'fetch_success';
export const FETCH_ERROR = 'fetch_error';

export const UPDATE_AUTH_USER = 'update_auth_user';
export const UPDATE_LOAD_USER = 'update_load_user';
export const SEND_FORGET_PASSWORD_EMAIL = 'send_forget_password_email';
export const SIGNIN_GOOGLE_USER_SUCCESS = 'signin_google_user_success';
export const SIGNIN_FACEBOOK_USER_SUCCESS = 'signin_facebook_user_success';
export const SIGNIN_TWITTER_USER_SUCCESS = 'signin_twitter_user_success';
export const SIGNIN_GITHUB_USER_SUCCESS = 'signin_github_user_SUCCESS';
export const SIGNIN_USER_SUCCESS = 'signin_user_success';
export const SIGNOUT_USER_SUCCESS = 'signout_user_success';

export const SET_DASHBOARD_DATA = 'set_dashboard_data';

export const SET_TASK_CURRENT_USER = 'set_task_current_user';
export const SET_TASKS_DATA = 'set_tasks_data';
export const SET_TASK_LIST_DATA = 'set_task_list_data';
export const ADD_TASK = 'add_task';
export const DELETE_TASK = 'delete_task';
export const UPDATE_TASK = 'update_task';
export const SET_FILTER_DATA = 'set_filter_data';
export const ADD_TASK_LIST = 'add_task_list';
export const UPDATE_TASK_LIST = 'update_task_list';
export const DELETE_TASK_LIST = 'delete_task_list';
export const SET_TASK_DETAIL = 'set_task_detail';
export const SEND_MESSAGE = 'send_message';
export const TOGGLE_SIDEBAR_COLLAPSED = 'toggle_sidebar_collapsed';
export const GET_TASKS_COUNTS = 'get_tasks_counts';

//mail app
export const GET_LABELS_LIST = 'get_labels_list';
export const GET_CONNECTIONS_LIST = 'get_connections_list';
export const GET_MAILS_LIST = 'get_mails_list';
export const UPDATE_MAIL_FOLDER = 'update_mail_folder';
export const UPDATE_MAIL_LABEL = 'upade_mail_label';
export const UPDATE_FAVORITE_STATUS = 'update_favorite_status';
export const UPDATE_READ_STATUS = 'update_read_status';
export const UPDATE_IMPORTANT_STATUS = 'update_important_status';
export const COMPOSE_MAIL = 'compose_mail';
export const SET_FILTER_TYPE = 'set_filter_type';
export const GET_SELECTED_MAIL = 'GET_SELECTED_MAIL';
export const UPDATE_SELECTED_MAIL = 'update_selected_mail';
export const NULLIFY_SELECTED_MAIL = 'nullify_selected_mail';
export const REPLY_TO_MAIL = 'reply_to_mail';
export const GET_MAIL_COUNTS = 'get_mail_count';
export const ADD_LABEL = 'add_label';
export const ADD_CONNECTION = 'add_connection';
export const REMOVE_CONNECTION = 'remove_connection';

export const SET_CHAT_USERS = 'set_chat_users';
export const SET_CONTACT_USERS = 'set_contact_users';
export const SET_CURRENT_USER = 'set_current_user';
export const SET_CONVERSATION_DATA = 'set_conversation_data';
export const SEND_NEW_CHAT_MESSAGE = 'send_new_chat_message';
export const SEND_NEW_MEDIA_MESSAGE = 'send_new_media_message';

//Contact App
export const GET_CONTACTS_LIST = 'get_contacts_list';
export const SET_CURRENT_CONTACT = 'set_current_contact';
export const CREATE_CONTACT = 'create_contact';
export const UPDATE_STARRED_STATUS = 'update_starred_status';
export const DELETE_CONTACT = 'delete_contact';
export const UPDATE_CONTACT_LABEL = 'update_contact_label';
export const UPDATE_CONTACT = 'update_contact';
export const GET_CONTACT_COUNTS = 'get_contact_counts';
export const UPDATE_LABEL_ITEM = 'update_label_item';
export const DELETE_LABEL_ITEM = 'delete_label_item';

export const GET_USER_DETAIL = 'get_user_detail';
export const GET_FEED_POSTS = 'get_feed_posts';
export const CREATE_POST = 'create_post';
export const UPDATE_POST = 'update_post';

// Users Module
export const GET_USERS = 'GET_USERS';
export const ADD_USER = 'ADD_USER';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const EDIT_USER = 'EDIT_USER';
export const DELETE_USER = 'DELETE_USER';
export const DELETE_BULK_USERS = 'DELETE_BULK_USERS';
export const GET_USER_ROLES = 'GET_USER_ROLES';
//export const GET_USER_PURCHASE_AREAS = 'GET_USER_PURCHASE_AREAS';
//export const GET_USER_BUSINESS_UNITS = 'GET_USER_BUSINESS_UNITS';
export const GET_USER_APPLICATIONS = 'GET_USER_APPLICATIONS';


// Roles Module
export const GET_ROLES = 'GET_ROLES';
export const ADD_ROLE = 'ADD_ROLE';
export const SET_ROLE_DETAILS = 'SET_ROLE_DETAILS';
export const EDIT_ROLE = 'EDIT_ROLE';
export const DELETE_ROLE = 'DELETE_ROLE';
export const DELETE_BULK_ROLES = 'DELETE_BULK_ROLES';
export const SET_CURRENT_ROLE = 'SET_CURRENT_ROLE';

// Cartas Module
export const GET_CARTAS = 'GET_CARTAS';
export const GET_PRODUCTOS_CARTA = 'GET_PRODUCTOS_CARTA';
export const ADD_CARTA= 'ADD_CARTA';
export const SET_CARTA_DETAILS = 'SET_CARTA_DETAILS';
export const EDIT_CARTA = 'EDIT_CARTA';
export const DELETE_CARTA = 'DELETE_CARTA';
export const DELETE_BULK_CARTAS = 'DELETE_BULK_CARTAS';
export const SET_CURRENT_CARTA = 'SET_CURRENT_CARTA';

// Category Managers Module
export const GET_CATEGORY_MANAGERS = 'GET_CATEGORY_MANAGERS';
export const ADD_CATEGORY_MANAGER= 'ADD_CATEGORY_MANAGER';
export const SET_CATEGORY_MANAGER_DETAILS = 'SET_CATEGORY_MANAGER_DETAILS';
export const EDIT_CATEGORY_MANAGER = 'EDIT_CATEGORY_MANAGER';
export const DELETE_CATEGORY_MANAGER = 'DELETE_CATEGORY_MANAGER';
export const DELETE_BULK_CATEGORY_MANAGERS = 'DELETE_BULK_CATEGORY_MANAGERS';
export const SET_CURRENT_CATEGORY_MANAGER = 'SET_CURRENT_CATEGORY_MANAGER';
export const SET_CATEGORY_MANAGERS = 'SET_CATEGORY_MANAGERS';
export const GET_CATEGORY_MANAGER_BY_LOGIN = 'GET_CATEGORY_MANAGER_BY_LOGIN';

//  Standard Report
export const GET_STANDARD_APPLIED_TO_MAJOR = 'GET_STANDARD_APPLIED_TO_MAJOR';

// Ordenes Compra Module
export const GET_ORDENES_COMPRA_BY_RUT_PROVEEDOR = 'GET_ORDENES_COMPRA_BY_RUT_PROVEEDOR';
export const GET_PRODUCTOS_ORDEN_COMPRA_BY_RUT_PROVEEDOR = 'GET_PRODUCTOS_ORDEN_COMPRA_BY_RUT_PROVEEDOR';
export const SET_PRODUCTOS_ORDEN_COMPRA = 'SET_PRODUCTOS_ORDEN_COMPRA';
export const DELETE_PRODUCTO_ORDEN_COMPRA = 'DELETE_PRODUCTO_ORDEN_COMPRA';
export const DELETE_BULK_PRODUCTOS_ORDEN_COMPRA = 'DELETE_BULK_PRODUCTOS_ORDEN_COMPRA';

// Ordenes Compra Module
export const ADD_FILE_CCV    = 'ADD_FILE_CCV';
export const GET_FILES_CCV   = 'GET_FILES_CCV';
export const SET_FILE_CCV    = 'SET_FILE_CCV';
export const DELETE_FILE_CCV = 'DELETE_FILE_CCV';


// Aplicaciones Module
export const GET_APLICACIONES = 'GET_APLICACIONES';
export const ADD_APLICACION = 'ADD_APLICACION';
export const SET_APLICACION_DETAIL = 'SET_APLICACION_DETAIL';
export const EDIT_APLICACION = 'EDIT_APLICACION';
export const DELETE_APLICACION = 'DELETE_APLICACION';
export const DELETE_BULK_APLICACIONES = 'DELETE_BULK_APLICACIONES';
export const SET_CURRENT_APLICACION = 'SET_CURRENT_APLICACION';
export const GET_APLICACIONES_PADRE = 'GET_APLICACIONES_PADRE';
export const GET_ROL_APLICACIONES = 'GET_ROL_APLICACIONES';



// Proveedores Module
export const GET_PROVEEDORES = 'GET_PROVEEDORES';
export const ADD_PROVEEDOR = 'ADD_PROVEEDOR';
export const SET_PROVEEDOR_DETAIL = 'SET_PROVEEDOR_DETAIL';
export const EDIT_PROVEEDOR = 'EDIT_PROVEEDOR';
export const DELETE_PROVEEDOR = 'DELETE_PROVEEDOR';
export const DELETE_BULK_PROVEEDORES = 'DELETE_BULK_PROVEEDORES';
export const SET_CURRENT_PROVEEDOR = 'SET_CURRENT_PROVEEDOR';
export const GET_PROVEEDOR_CATEGORY_MANAGERS = 'GET_PROVEEDOR_CATEGORY_MANAGERS';
export const GET_CATEGORY_MANAGER_PROVEDORES = 'GET_CATEGORY_MANAGER_PROVEDORES';
export const SET_PROVEEDORES_CATEGORY_MANAGER = 'SET_PROVEEDORES_CATEGORY_MANAGER';


// Proveedores Module
export const GET_EMPRESAS = 'GET_EMPRESAS';