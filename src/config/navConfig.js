const navList = [
  {
    title: 'HOME',
    key: '/home',
    icon: 'home',
    public: true,
  },
  {
    title: 'PRODUCTS',
    key: '/productskey',
    icon: 'appstore',
    children: [
      {
        title: 'CATEGORY',
        key: '/category',
        icon: 'bars'
      },
      {
        title: 'PRODUCT',
        key: '/product',
        icon: 'tool'
      },
    ]
  },

  {
    title: 'USER',
    key: '/user',
    icon: 'user'
  },
  {
    title: 'ROLE',
    key: '/role',
    icon: 'safety',
  },

  {
    title: 'STATISTIC',
    key: '/statistickey',
    icon: 'area-chart',
    children: [
      {
        title: 'BAR CHART',
        key: '/statistic/bar',
        icon: 'bar-chart'
      },
      {
        title: 'LINE CHART',
        key: '/statistic/line',
        icon: 'line-chart'
      },
      {
        title: 'PIE CHART',
        key: '/statistic/pie',
        icon: 'pie-chart'
      },
    ]
  },
]

export default navList;