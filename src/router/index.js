import Vue from 'vue'
import Router from 'vue-router'
import SellerPage from '../views/SellerPage'
import Seller from '@/components/Seller'
import TrendPage from '../views/TrendPage'

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
      path: '/',
      name: 'Seller',
      component: Seller
    }
  ]
})
