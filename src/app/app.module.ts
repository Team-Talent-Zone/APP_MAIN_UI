import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { HomepriceComponent } from './homepricesection/homeprice.component';
import { HomecbasectionComponent } from './homecbasection/homecbasection.component';
import { HomefusectionComponent } from './homefusection/homefusection.component';
import { HeaderComponent } from './header/header.component';
import { HomewhatwedoComponent } from './homewhatwedosection/homewhatwedo.component';
import { HomeservicesectionComponent } from './homeservicesection/homeservicesection.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReferenceAdapter} from './adapters/referenceadapter';
import { AlertComponent } from './alert/alert.component';
import { AlertsService } from './AppRestCall/alerts/alerts.service';
import { UserService } from './AppRestCall/user/user.service';
import { ReferenceService } from './AppRestCall/reference/reference.service';
import { UserAdapter } from './adapters/useradapter';
import { HttpErrorInterceptor } from './alert/http-error.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    HomepriceComponent,
    HomecbasectionComponent,
    HomefusectionComponent,
    HeaderComponent,
    HomewhatwedoComponent,
    HomeservicesectionComponent,
    SignupComponent,
    AlertComponent,
    DashboardComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    BsModalRef,
    ReferenceAdapter,
    UserAdapter,
    AlertsService ,
    UserService ,
    ReferenceService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
