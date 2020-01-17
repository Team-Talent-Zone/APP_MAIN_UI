import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { HomepriceComponent } from './homepricesection/homeprice.component';
import { HomecbasectionComponent } from './homecbasection/homecbasection.component';
import { HomefusectionComponent } from './homefusection/homefusection.component';
import { HeaderComponent } from './header/header.component';
import { HomewhatwedoComponent } from './homewhatwedosection/homewhatwedo.component';
import { HomeservicesectionComponent } from './homeservicesection/homeservicesection.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
