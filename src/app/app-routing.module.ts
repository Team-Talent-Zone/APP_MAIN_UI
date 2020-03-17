import { SignupadminComponent } from './signupadmin/signupadmin.component';
import { DashboardbyuseroleComponent } from './dashboardbyuserole/dashboardbyuserole.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { ManageuserComponent } from './manageuser/manageuser.component';
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
    component: HomeComponent
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
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: DashboardbyuseroleComponent
      }
    ]
  },
  {
    path: 'dashboard/:name',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: DashboardbyuseroleComponent
      }
    ]
  },
  {
    path: 'manageuser',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: ManageuserComponent
      }
    ]
  },
  {
    path: 'signupadmin',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: SignupadminComponent
      }
    ]
  },
  {
    path: 'vieworeditprofile/:id',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: EditprofileComponent
      }
    ]
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
