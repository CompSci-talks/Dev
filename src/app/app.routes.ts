import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./portal/pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'archive',
        loadComponent: () => import('./portal/pages/archive/archive.component').then(m => m.ArchiveComponent)
    },
    {
        path: 'schedule',
        loadComponent: () => import('./portal/pages/schedule/schedule.component').then(m => m.ScheduleComponent)
    },
    {
        path: 'seminar/:id',
        loadComponent: () => import('./portal/pages/seminar-detail/seminar-detail.component').then(m => m.SeminarDetailComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        canActivate: [AdminGuard],
        loadComponent: () => import('./admin/components/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        children: [
            { path: '', redirectTo: 'semesters', pathMatch: 'full' },
            {
                path: 'semesters',
                loadComponent: () => import('./admin/pages/semester-manager/semester-manager.component').then(m => m.SemesterManagerComponent)
            },
            {
                path: 'seminars',
                loadComponent: () => import('./admin/pages/seminar-manager/seminar-manager.component').then(m => m.SeminarManagerComponent)
            },
            {
                path: 'moderation',
                loadComponent: () => import('./admin/pages/comment-moderation/comment-moderation.component').then(m => m.CommentModerationComponent)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
