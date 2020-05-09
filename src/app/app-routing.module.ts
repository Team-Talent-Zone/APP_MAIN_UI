import { CreateoreditwidgetComponent } from './createoreditwidget/createoreditwidget.component';
import { UsersubscribeservicesComponent } from './usersubscribeservices/usersubscribeservices.component';
import { ViewuserservicedetailsComponent } from './viewuserservicedetails/viewuserservicedetails.component';
import { PaymenthistComponent } from './paymenthist/paymenthist.component';
import { DashboardsearchbyfilterComponent } from './dashboardsearchbyfilter/dashboardsearchbyfilter.component';
import { HomepriceComponent } from './homepricesection/homeprice.component';
import { NewserviceComponent } from './newservice/newservice.component';
import { SignupadminComponent } from './signupadmin/signupadmin.component';
import { DashboardmapbyuseroleComponent } from './dashboardmapbyuserole/dashboardmapbyuserole.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { ManageuserComponent } from './manageuser/manageuser.component';
import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthgaurdService } from './AppRestCall/authgaurd/authgaurd.service';
import { ManageserviceComponent } from './manageservice/manageservice.component';
import { Error504pageComponent } from './error504page/error504page.component';
import { ViewfujobdetailsComponent } from './viewfujobdetails/viewfujobdetails.component';
import { ManagejobsComponent } from './managejobs/managejobs.component';

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
    canActivate: [AuthgaurdService],
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
    canActivate: [AuthgaurdService],
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
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: NewserviceComponent
      }
    ]
  },
  {
    path: 'dashboard/:code/:name/:filtername',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: DashboardsearchbyfilterComponent
      }
    ]
  },
  {
    path: 'job',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: ManagejobsComponent
      }
    ]
  },
  {
    path: 'job/:code/:name/:filtername',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: ManagejobsComponent
      }
    ]
  },
  {
    path: 'dashboard/:txtid',
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
    path: 'signupadmin',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
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
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: ManageserviceComponent
      }
    ]
  },
  {
    path: 'usersubscribeservices',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: UsersubscribeservicesComponent
      }
    ]
  },

  {
    path: 'createoreditwidget/:id',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: CreateoreditwidgetComponent
      }
    ]
  },
  {
    path: 'viewuserservicedetails/:id',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: ViewuserservicedetailsComponent
      }
    ]
  },
  {
    path: 'viewfujobdetails/:id',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: ViewfujobdetailsComponent
      }
    ]
  },
  {
    path: 'vieworeditprofile/:id',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: EditprofileComponent
      }
    ]
  },
  {
    path: '504error',
    component: Error504pageComponent,
    canActivate: [AuthgaurdService]
  },
  {
    path: 'paymenthistory',
    component: DashboardComponent,
    canActivate: [AuthgaurdService],
    children: [
      {
        path: '',
        component: PaymenthistComponent
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
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
