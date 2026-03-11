import { Routes } from '@angular/router';

export const routes: Routes = [
    // {
    //   path: '',
    //   loadComponent: () => import('./portal/pages/home/home.component').then(m => m.HomeComponent)
    // },
    // {
    //   path: 'archive',
    //   loadComponent: () => import('./portal/pages/archive/archive.component').then(m => m.ArchiveComponent)
    // },
    // {
    //   path: 'seminar/:id',
    //   loadComponent: () => import('./portal/pages/seminar-detail/seminar-detail.component').then(m => m.SeminarDetailComponent)
    // },
    // {
    //   path: 'login',
    //   loadComponent: () => import('./auth/pages/login/login.component').then(m => m.LoginComponent)
    // },
    // {
    //   path: 'register',
    //   loadComponent: () => import('./auth/pages/register/register.component').then(m => m.RegisterComponent)
    // },
    // {
    //   path: 'dashboard',
    //   loadComponent: () => import('./dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    //   canActivate: [/* AuthGuard */]
    // },
    { path: '**', redirectTo: '' }
];
