import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectLoginGuard } from './guards/redirect-login.guard';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AdminLayoutComponent } from './modules/shared/components/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
    canActivate: [RedirectLoginGuard]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'users',
        loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'products',
        loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule),
      },
      {
        path: 'roles',
        loadChildren: () => import('./modules/roles/roles.module').then(m => m.RolesModule),
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
