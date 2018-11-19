import { Component } from '@angular/core';
import { GithubService } from 'src/lib/github/services/github.service';

import { AppSettings } from './models/app-settings';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  settings: AppSettings;

  constructor(private settingsService: SettingsService, private githubService: GithubService) {
    const settings = this.settingsService.get();
    if (settings.clientId && settings.clientSecret) {
      this.githubService.setOAuth(settings.clientId, settings.clientSecret);
    }
    this.settings = settings;
  }
}
