import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../options/components/Index'
import Import from '../options/components/Import'
import Export from '../options/components/Export'
import Destroy from '../options/components/Destroy'
import System from '../options/components/System'
import Data from '../options/components/Data'
import Like from '../options/components/Like'
Vue.use(VueRouter)
const routes = [{
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/import',
        name: 'Import',
        component: Import
    },
    {
        path: '/export',
        name: 'Export',
        component: Export
    },
    {
        path: '/destroy',
        name: 'Destroy',
        component: Destroy
    },
    {
        path: '/system',
        name: 'System',
        component: System
    },
    {
        path: '/data',
        name: 'Data',
        component: Data
    },
    {
        path: '/like',
        name: 'Like',
        component: Like
    },
]

const router = new VueRouter({
    routes
})

export default router