import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { GithubService } from 'src/lib/github/services/github.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RepositorySummaryComponent } from './components/repository-summary/repository-summary.component';
import { SearchUserBoxComponent } from './components/search-user-box/search-user-box.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserSummaryComponent } from './components/user-summary/user-summary.component';
import { CacheHttpInterceptor } from './interceptors/cache-http-interceptor';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RepositoryPageComponent } from './pages/repository-page/repository-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';

@NgModule({
  declarations: [
    AppComponent,
    // Pages
    HomePageComponent,
    RepositoryPageComponent,
    SettingsPageComponent,
    UserPageComponent,
    // Components
    SearchUserBoxComponent,
    PaginationComponent,
    UserSummaryComponent,
    UserDetailComponent,
    RepositorySummaryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbDropdownModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheHttpInterceptor,
      multi: true
    },
    {
      provide: GithubService,
      useClass: GithubService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
