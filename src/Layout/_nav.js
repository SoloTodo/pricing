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
      url: '/skus',
      icon: 'fas fa-inbox',
      requiredPermission: 'solotodo.backend_list_entities',
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
      name: 'Suscripción a Tiendas',
      url: '/store_subscriptions',
      icon: 'fas fa-store'
    },
    {
      name: 'Banner Visibility',
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
      name: 'Keyword Visibility',
      icon: 'fas fa-key',
      requiredPermission: 'keyword_search_positions.backend_list_keyword_searches',
      children: [
        {
          name: 'Búsquedas',
          url: '/keyword_searches'
        },
        {
          name: 'Reporte actual',
          url: '/keyword_searches/active_report'
        }
      ]

    },
    {
      name: 'Reportes',
      url: '/reports',
      icon: 'fas fa-file-excel'
    }
  ],
};
