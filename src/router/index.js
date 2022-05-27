import Vue from 'vue';
import Router from 'vue-router';
import store from "../store";
Vue.use(Router);

const router = new Router({
    mode: 'history',
    scrollBehavior() {
        return window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    routes: [

        // Dashboards

        {
            path: '/',
            name: 'login',
            meta: {layout: 'userpages' , guest: true},
            component: () => import('../views/Auth/Login.vue'),
        },
        {
            path: '/registrar',
            name: 'register',
            meta: {layout: 'userpages', guest: true},
            component: () => import('../views/Auth/Register.vue'),
        },
        {
            path: '/recuperar-senha',
            name: 'recover-password',
            meta: {layout: 'userpages' , guest: true},
            component: () => import('../views/Auth/ForgotPassword.vue'),
        },
        {
            path: '/resetar-senha',
            name: 'reset-password',
            meta: {layout: 'userpages' , guest: true},
            props: (route) => ({ urlToken: route.query.token }), 
            component: () => import('../views/Auth/ResetPassword.vue'),
        },
        {
            path: '/cronograma',
            name: 'home',
            meta: {requiresAuth: true},
            component: () => import('../views/Home/Schedule.vue'),
        },
        {
            path: '/historico',
            name: 'history',
            meta: {requiresAuth: true},
            component: () => import('../views/Home/History.vue'),
        },
        {
            path: '/perfil',
            name: 'profile',
            meta: {requiresAuth: true},
            component: () => import('../views/Profile.vue'),
        },
        // Users
        {
            path: '/usuarios',
            name: 'usersIndex',
            meta: {requiresAuth: true , permission: 'view users'},
            component: () => import('../views/Users/Index.vue'),
        },
        {
            path: '/usuarios/criar',
            name: 'usersCreate',
            meta: {requiresAuth: true , permission: 'create users'},
            component: () => import('../views/Users/Create.vue'),
        },
        {
            path: '/usuarios/:id',
            name: 'usersShow',
            meta: {requiresAuth: true , permission: 'show users'},
            component: () => import('../views/Users/Show.vue'),
        },
        //Vehicles
        {
            path: '/veiculos',
            name: 'vehiclesIndex',
            meta: {requiresAuth: true , permission: 'view vehicles'},
            component: () => import('../views/Vehicles/Index.vue'),
        },
        {
            path: '/veiculos/criar',
            name: 'vehiclesCreate',
            meta: {requiresAuth: true , permission: 'create vehicles'},
            component: () => import('../views/Vehicles/Create.vue'),
        },
        {
            path: '/veiculos/:id',
            name: 'vehiclesShow',
            meta: {requiresAuth: true , permission: 'show vehicles'},
            component: () => import('../views/Vehicles/Show.vue'),
        },
        {
            path: '/veiculos/:id/historico',
            name: 'vehiclesShowHistory',
            meta: {requiresAuth: true , permission: 'show vehicles'},
            component: () => import('../views/Vehicles/History.vue'),
        },
        //SupportRequests
        {
            path: '/ajuda',
            name: 'supportRequestsIndex',
            meta: {requiresAuth: true, permission: 'create supportRequests'},
            component: () => import('../views/SupportRequests/Index.vue'),
        },
        {
            path: '/solicitacoes',
            name: 'supportRequestsIndexManager',
            meta: {requiresAuth: true, permission: 'view supportRequests'},
            component: () => import('../views/SupportRequests/IndexManager.vue'),
        },
        {
            path: '/solicitacoes/:id',
            name: 'supportRequestsShow',
            meta: {requiresAuth: true , permission: 'view supportRequests'},
            component: () => import('../views/SupportRequests/Show.vue'),
        },

        //Routes
        {
            path: '/rotas',
            name: 'routesIndex',
            meta: {requiresAuth: true , permission: 'view routes'},
            component: () => import('../views/Routes/Index.vue'),
        },
        {
            path: '/rotas/criar',
            name: 'routesCreate',
            meta: {requiresAuth: true , permission: 'create routes'},
            component: () => import('../views/Routes/Create.vue'),
        },
        {
            path: '/rotas/:id',
            name: 'routesShow',
            meta: {requiresAuth: true , permission: 'show routes'},
            component: () => import('../views/Routes/Show.vue'),
        },

        {
            path: '/pages/login-boxed',
            name: 'login-boxed',
            meta: {layout: 'userpages'},
            component: () => import('../DemoPages/UserPages/LoginBoxed.vue'),
        },
        {
            path: '/pages/register-boxed',
            name: 'register-boxed',
            meta: {layout: 'userpages'},
            component: () => import('../DemoPages/UserPages/RegisterBoxed.vue'),
        },
        {
            path: '/pages/forgot-password-boxed',
            name: 'forgot-password-boxed',
            meta: {layout: 'userpages'},
            component: () => import('../DemoPages/UserPages/ForgotPasswordBoxed.vue'),
        },

        // Elements

        {
            path: '/elements/buttons-standard',
            name: 'buttons-standard',
            component: () => import('../DemoPages/Elements/Buttons/Standard.vue'),
        },
        {
            path: '/elements/dropdowns',
            name: 'dropdowns',
            component: () => import('../DemoPages/Elements/Dropdowns.vue'),
        },
        {
            path: '/elements/icons',
            name: 'icons',
            component: () => import('../DemoPages/Elements/Icons.vue'),
        },
        {
            path: '/elements/badges-labels',
            name: 'badges',
            component: () => import('../DemoPages/Elements/Badges.vue'),
        },
        {
            path: '/elements/cards',
            name: 'cards',
            component: () => import('../DemoPages/Elements/Cards.vue'),
        },
        {
            path: '/elements/list-group',
            name: 'list-group',
            component: () => import('../DemoPages/Elements/ListGroups.vue'),
        },
        {
            path: '/elements/timelines',
            name: 'timeline',
            component: () => import('../DemoPages/Elements/Timeline.vue'),
        },
        {
            path: '/elements/utilities',
            name: 'utilities',
            component: () => import('../DemoPages/Elements/Utilities.vue'),
        },

        // Components

        {
            path: '/components/tabs',
            name: 'tabs',
            component: () => import('../DemoPages/Components/Tabs.vue'),
        },
        {
            path: '/components/accordions',
            name: 'accordions',
            component: () => import('../DemoPages/Components/Accordions.vue'),
        },
        {
            path: '/components/modals',
            name: 'modals',
            component: () => import('../DemoPages/Components/Modals.vue'),
        },
        {
            path: '/components/progress-bar',
            name: 'progress-bar',
            component: () => import('../DemoPages/Components/ProgressBar.vue'),
        },
        {
            path: '/components/tooltips-popovers',
            name: 'tooltips-popovers',
            component: () => import('../DemoPages/Components/TooltipsPopovers.vue'),
        },
        {
            path: '/components/carousel',
            name: 'carousel',
            component: () => import('../DemoPages/Components/Carousel.vue'),
        },
        {
            path: '/components/pagination',
            name: 'pagination',
            component: () => import('../DemoPages/Components/Pagination.vue'),
        },
        {
            path: '/components/maps',
            name: 'maps',
            component: () => import('../DemoPages/Components/Maps.vue'),
        },

        // Tables

        {
            path: '/tables/regular-tables',
            name: 'regular-tables',
            component: () => import('../DemoPages/Tables/RegularTables.vue'),
        },

        // Dashboard Widgets

        {
            path: '/widgets/chart-boxes-3',
            name: 'chart-boxes-3',
            component: () => import('../DemoPages/Widgets/ChartBoxes3.vue'),
        },

        // Forms

        {
            path: '/forms/controls',
            name: 'controls',
            component: () => import('../DemoPages/Forms/Elements/Controls.vue'),
        },
        {
            path: '/forms/layouts',
            name: 'layouts',
            component: () => import('../DemoPages/Forms/Elements/Layouts.vue'),
        },
        // Charts

        {
            path: '/charts/chartjs',
            name: 'chartjs',
            component: () => import('../DemoPages/Charts/Chartjs.vue'),
        },
        { 
            path: '/:pathMatch(.*)*', 
            name: 'NotFound', 
            component: () => import('../views/NotFound.vue'),
            meta: {layout: 'userpages'}
        },
        {
            path: '*',
            component: () => import('../views/NotFound.vue'),
            meta: {layout: 'userpages'},
        },
        
    ]
});
export default router;

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (store.getters.isAuthenticated) {
        next();
        return;
      }
      next({name:"login"});
    } else {
      next();
    }
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.permission)) {
      if (store.getters.StatePermissions) {
        if(store.getters.StatePermissions.includes(to.meta.permission)){
            next();
            return;
        }
      }
      next({name:"home"});
    } else {
      next();
    }
});
  
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.guest)) {
      if (store.getters.isAuthenticated) {
        next({name:"home"});
        return;
      }
      next();
    } else {
      next();
    }
});