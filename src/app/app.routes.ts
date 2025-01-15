import { Routes } from '@angular/router';
import { loginGuard } from '@/app/guards/login.guard';
import { authGuard } from  '@/app/guards/auth.guard';

export const routes: Routes = [
    { 
        path: "login", loadComponent: () => import("@/app/components/login/login.component").then(m => m.LoginComponent), 
        title: "SimpleNotes | Login", canActivate:[loginGuard]
    },
    {
        path:'', loadComponent: () => import("@/app/components/notes/notes.component").then(m => m.NotesComponent),
        title: 'SimpleNotes | Your notes', canActivate:[authGuard]
    },
    {
        path:'editor', loadComponent: () => import("@/app/components/editor/editor.component").then(m => m.EditorComponent),
        title: 'SimpleNotes | Editor', canActivate:[authGuard]
    },
    {path: '**', loadComponent: ()=> import('@/app/components/shared/error/error.component').then(m => m.ErrorComponent), title: 'SimpleNotes | Error'}
];
