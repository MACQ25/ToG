import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/main/main.module').then(m => m.MainModule),
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    },
    {
        path: 'gallery',
        loadChildren: () => import('./features/gallery/gallery.module').then(m => m.GalleryModule)
    }
];
