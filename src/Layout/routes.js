import React from 'react'

import PasswordChange from "../views/Pages/PasswordChange";
import StoreList from "../views/Pages/StoreList";
import StoreDetail from "../views/Pages/StoreDetail";
import StoreDetailUpdateLogs from "../views/Pages/StoreDetailUpdateLogs"
import SkuList from "../views/Pages/SkuList"

import ResourceObjectPermission from "../react-utils/components/ResourceObjectPermission";
import RequiredResources from "../react-utils/components/RequiredResources"
import SkuDetail from "../views/Pages/SkuDetail";

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  //{ path: '/', exact: true, name: 'Home', component:Layout },
  { path: '/account/password_change', exact: true, name: 'Cambiar contraseña', component: PasswordChange },
  { path: '/stores', exact: true, name: 'Tiendas', component: StoreList },
  { path: '/stores/:id', exact: true, name: 'Detalle', render: props => <ResourceObjectPermission match={props.match} resource="stores" component={StoreDetail} />},
  { path: '/stores/:id/update_logs', exact: true, name: 'Registros de actualización', render: props => <RequiredResources resources={['categories']}>
      <ResourceObjectPermission match={props.match} resource="stores" permission="view_store_update_logs" component={StoreDetailUpdateLogs} />
  </RequiredResources>},
  { path: '/skus', exact: true, name:'SKUs', render: props => <RequiredResources resources={['categories', 'stores']}><SkuList/></RequiredResources>},
  { path: '/skus/:id', exact: true, name: 'Detalle', render: props => <RequiredResources resources={['stores', 'categories', 'users_with_staff_actions']}>
      <ResourceObjectPermission match={props.match} resource="entities" component={SkuDetail}/>
    </RequiredResources>}
];

export default routes;
