import { DashboardsearchfuComponent } from './dashboardsearchfu/dashboardsearchfu.component';
import { HomepriceComponent } from './homepricesection/homeprice.component';
import { ManageuserserviceComponent } from './manageuserservice/manageuserservice.component';
import { NewserviceComponent } from './newservice/newservice.component';
import { SignupadminComponent } from './signupadmin/signupadmin.component';
import { DashboardmapbyuseroleComponent } from './dashboardmapbyuserole/dashboardmapbyuserole.component';
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
import { ManageserviceComponent } from './manageservice/manageservice.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'home/:name/:id',
    component: HomeComponent
  },
  {
    path: 'region/:name',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: HomepriceComponent
      }
    ],
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
        component: DashboardmapbyuseroleComponent
      },
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
    path: 'newservice',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: NewserviceComponent
      }
    ]
  },
  {
    path: 'editorviewnewservice/:id',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: NewserviceComponent
      }
    ]
  },
  {
    path: 'dashboard/:name',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardsearchfuComponent
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
    path: 'manageservice',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: ManageserviceComponent
      }
    ]
  },
  {
    path: 'manageuserservice',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: ManageuserserviceComponent
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
  imports: [RouterModule.forRoot(routes , {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
