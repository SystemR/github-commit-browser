import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { RepositoryPageComponent } from './pages/repository-page/repository-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'settings',
    component: SettingsPageComponent
  },
  {
    path: ':login',
    component: UserPageComponent
  },
  {
    path: ':login/:repo',
    component: RepositoryPageComponent
  },
  {
    path: ':login/:repo/:commit',
    component: RepositoryPageComponent
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
