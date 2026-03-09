import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores'
import api from '@/api/axios/axios'

import Dashboard from '@/views/dashboard.vue'
import Login from '@/views/auth/boxed-signin.vue'

const routes = [

{
path: '/',
redirect: '/dashboard',
},

{
path: '/dashboard',
name: 'dashboard',
component: Dashboard,
meta:{
requiresAuth:true,
layout:'app'
}
},

{
path: '/analytics',
redirect: '/dashboard',
},

// ================= USERS =================

{
path: '/users/employees',
component: () => import('@/views/users/employees-table.vue'),
meta:{
requiresAuth:true,
layout:'app',
roles:['Superuser','Administrador','Owner']
}
},

{
path: '/users/create',
component: () => import('@/views/auth/boxed-signup.vue'),
meta:{
requiresAuth:true,
layout:'app',
roles:['Superuser','Administrador']
}
},

{
path: '/users/password-reset',
component: () => import('@/views/auth/cover-password-reset.vue'),
meta:{
requiresAuth:true,
layout:'app',
roles:['Superuser','Administrador']
}
},

{
path: '/users/roles',
component: () => import('@/views/users/UserRolesView.vue'),
meta:{
requiresAuth:true,
layout:'app',
roles:['Superuser','Administrador']
}
},

{
path: '/users/unidades-negocio',
component: () => import('@/views/users/UnidadesNegocioView.vue'),
meta:{
requiresAuth:true,
layout:'app',
roles:['Superuser']
}
},

// ================= PROJECTS =================

{
path: '/project/create',
component: () => import('@/views/project/CreateProyect.vue'),
meta:{
requiresAuth:true,
layout:'app',
roles:['Superuser','Administrador','Owner','Tester']
}
},

{
path: '/project',
component: () => import('@/views/project/ViewProyect.vue'),
meta:{
requiresAuth:true,
layout:'app',
roles:['Superuser','Administrador','Owner','Tester']
}
},

// ================= TEAMS =================

{
path: '/teams',
component: () => import('@/views/teams/TeamsView.vue'),
meta:{
requiresAuth:true,
layout:'app',
roles:['Superuser','Administrador','Owner']
}
},

{
path: '/teams/create',
name: 'CreateTeam',
component: () => import('@/views/teams/tabs/CreateTeam.vue'),
meta:{
requiresAuth:true,
layout:'app',
roles:['Superuser','Administrador']
}
},

// ================= AUTH =================

{
path: '/auth/boxed-signin',
name: 'login',
component: Login,
meta:{ layout:'auth' }
},

{
path: '/auth/boxed-password-reset',
component: () => import('@/views/auth/boxed-password-reset.vue'),
meta:{ layout:'auth' }
},

{
path: '/auth/reset-password/:uid/:token',
component: () => import('@/views/auth/reset-password.vue'),
meta:{ layout:'auth' }
},

]

const router = createRouter({
history: createWebHistory(),
routes,
})

router.beforeEach(async (to, from, next) => {

const store = useAppStore()

store.setMainLayout(
to.meta?.layout === 'auth' ? 'auth' : 'app'
)

/* ================= AUTH ================= */

if (!to.meta.requiresAuth) {
next()
return
}

const tokenExp = localStorage.getItem('token_exp')

if (!tokenExp) {
next('/auth/boxed-signin')
return
}

const expDate = new Date(tokenExp)
const now = new Date()

if (now > expDate) {

localStorage.removeItem('token_exp')

next('/auth/boxed-signin')
return

}

try {

const res = await api.get('/itwframe/auth/me/')

const role = res.data.role

const roles = to.meta.roles as string[] | undefined

if (roles && !roles.includes(role)) {

next('/dashboard')
return

}

next()

} catch {

next('/auth/boxed-signin')

}

})

export default router