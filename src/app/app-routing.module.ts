import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthgaurdService } from './AppRestCall/authgaurd/authgaurd.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'home/:name/:id',
    component: HomeComponent,
  },
  {
    path: 'signup/:id',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: SignupComponent
      }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthgaurdService]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
