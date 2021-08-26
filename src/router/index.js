import Vue from 'vue'
import Router from 'vue-router'
import SellerPage from '../views/SellerPage'
import Seller from '@/components/Seller'
import TrendPage from '../views/TrendPage'
import MapPage from '../views/MapPage'
import RankPage from '../views/RankPage'
import HotPage from '../views/HotPage'
import StockPage from '../views/StockPage'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [

    {
      path: '/sellerpage',
      name: 'SellerPage',
      component: SellerPage
    }, {
      path: '/trendpage',
      name: 'TrendPage',
      component: TrendPage
    }, {
      path: '/mappage',
      name: 'MapPage',
      component: MapPage
    }, {
      path: '/rankpage',
      name: 'RankPage',
      component: RankPage
    }, {
      path: '/hotpage',
      name: 'HotPage',
      component: HotPage
    }, {
      path: '/stockpage',
      name: 'StockPage',
      component: StockPage
    }, {
      path: '/',
      name: 'Seller',
      component: Seller
    }
  ]
})
