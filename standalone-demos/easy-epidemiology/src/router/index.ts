import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { isAuthRequired } from '../utils/environmentUtils';
import { showToast } from '../components/DataInputVirtualScroll/logic/toast';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: () => {
            // If auth is not required, go to input
            if (!isAuthRequired()) {
                return '/input';
            }
            // If auth is required, check token (simplified check here, guard does real work)
            const token = localStorage.getItem('authToken');
            return token ? '/input' : '/login';
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "auth" */ '../components/AuthScreen/index.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/input',
        name: 'DataInputVirtual',
        component: () => import(/* webpackChunkName: "input" */ '../components/DataInputVirtualScroll/DataInputVirtual.vue'),
        meta: { title: '데이터 입력' }
    },
    {
        path: '/patient',
        name: 'PatientCharacteristics',
        component: () => import(/* webpackChunkName: "patient" */ '../components/PatientCharacteristics/index.vue'),
        meta: { title: '환자 특성' }
    },
    {
        path: '/curve',
        name: 'EpidemicCurve',
        component: () => import(/* webpackChunkName: "curve" */ '../components/EpidemicCurve/index.vue'),
        meta: { title: '유행 곡선' }
    },
    {
        path: '/symptoms',
        name: 'ClinicalSymptoms',
        component: () => import(/* webpackChunkName: "symptoms" */ '../components/ClinicalSymptoms/index.vue'),
        meta: { title: '임상 증상' }
    },
    {
        path: '/case-control',
        name: 'CaseControl',
        component: () => import(/* webpackChunkName: "case-control" */ '../components/CaseControl/index.vue'),
        meta: { title: '환자-대조군 연구' }
    },
    {
        path: '/cohort',
        name: 'CohortStudy',
        component: () => import(/* webpackChunkName: "cohort" */ '../components/CohortStudy/index.vue'),
        meta: { title: '코호트 연구' }
    },
    {
        path: '/case-series',
        name: 'CaseSeries',
        component: () => import(/* webpackChunkName: "case-series" */ '../components/CaseSeries/index.vue'),
        meta: { title: '사례군 조사' }
    },
    {
        path: '/report',
        name: 'ReportWriter',
        component: () => import(/* webpackChunkName: "report" */ '../components/ReportWriter/index.vue'),
        meta: { title: '보고서 작성' }
    },
    {
        path: '/info',
        name: 'HomePage',
        component: () => import(/* webpackChunkName: "info" */ '../components/Home/index.vue'),
        meta: { title: '웹페이지 정보', public: true }
    },
    {
        path: '/manual',
        name: 'UserManual',
        component: () => import(/* webpackChunkName: "manual" */ '../components/UserManual/index.vue'),
        meta: { title: '사용자 매뉴얼', public: true }
    },
    {
        path: '/admin',
        name: 'AdminPanel',
        component: () => import(/* webpackChunkName: "admin" */ '../components/AdminPanel/index.vue'),
        meta: { requiresAdmin: true, title: '관리자 패널' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation Guard
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // Update document title
    if (to.meta.title) {
        document.title = `${to.meta.title} - Easy Epidemiology`;
    }

    // 1. Check if Auth is required globally
    if (!isAuthRequired()) {
        return next();
    }

    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAuthenticated = !!(token && user && (user.isApproved || user.approved));
    const isAdmin = user && (user.role === 'admin' || user.role === 'support');

    // 2. Redirect to Login if not authenticated
    if (to.name !== 'Login' && !to.meta.public && !isAuthenticated) {
        return next({ name: 'Login' });
    }

    // 3. Prevent authenticated users from visiting Login
    if (to.name === 'Login' && isAuthenticated) {
        return next({ path: '/input' });
    }

    // 4. Admin Guard
    if (to.meta.requiresAdmin && !isAdmin) {
        showToast('접근 권한이 없습니다.', 'error');
        return next({ path: '/input' });
    }

    next();
});

export default router;
