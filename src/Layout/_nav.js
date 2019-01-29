export default {
  items: [
    {
      name: 'Tiendas',
      url: '/stores',
      icon: 'fas fa-store-alt',
      requiredPermission: 'solotodo.backend_list_stores'
    },
    {
      name: 'SKUs',
      url: '/skus',
      icon: 'fas fa-inbox',
      requiredPermission: 'solotodo.backend_list_stores'
    },
    {
      name: 'Categorías',
      url: '/categories',
      icon: 'fas fa-tv',
      requiredPermission: 'solotodo.backend_list_stores'
    }
  ],
};
