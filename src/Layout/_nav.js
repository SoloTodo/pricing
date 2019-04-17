export default {
  items: [
    {
      name: 'Tiendas',
      url: '/stores',
      icon: 'fas fa-store-alt',
      requiredPermission: 'solotodo.backend_list_stores'
    },
    {
      name: 'Categorías',
      url: '/categories',
      icon: 'fas fa-tv',
      requiredPermission: 'solotodo.backend_list_categories'
    },
    {
      name: 'SKUs',
      icon: 'fas fa-inbox',
      requiredPermission: 'solotodo.backend_list_entities',
      children: [
        {
          name: 'Todos',
          url: '/skus'
        },
        {
          name: 'Posiciones',
          url: '/sku_positions',
        }
      ]
    },
    {
      name: 'Productos',
      url: '/products',
      icon: 'fas fa-tags',
      requiredPermission: 'solotodo.backend_list_products'
    },
    {
      name: 'Comparación de Marcas',
      url: '/brand_comparisons',
      icon: 'fas fa-tags',
      requiredPermission: 'brand_comparisons.backend_list_brand_comparisons'
    },
    {
      name: 'Listas de Productos',
      url: '/product_lists',
      icon: 'fas fa-list',
      requiredPermission: 'product_lists.backend_list_product_lists'
    },
    {
      name: 'Alertas',
      url: '/alerts',
      icon: 'fas fa-bell'
    },
    {
      name: 'Banner Visibiliy',
      icon: 'fas fa-eye',
      requiredPermission: 'banners.backend_list_banners',
      children: [
        {
          name: 'Banners',
          url: '/banners'
        },
        {
          name: 'Active Participation',
          url: '/banners/active_participation'
        },
        {
          name: 'Historic Participation',
          url: '/banners/historic_participation'
        },
      ]
    },
    {
      name: 'Reportes',
      url: '/reports',
      icon: 'fas fa-file-excel'
    }
  ],
};
