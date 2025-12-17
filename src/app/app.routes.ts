import { Routes } from '@angular/router';
import { Profile } from './profile/profile';
import { ResumeBuilder } from './resume-builder/resume-builder';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Landing } from './landing/landing';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'home', component: Landing },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'pro',
        component: Profile,
        canActivate: [authGuard]
    },
    {
        path: 'myprofile',
        component: ResumeBuilder,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'signup',
        component: Register
    },
    {
        path: 'resume',
        component: ResumeBuilder
    }
];
