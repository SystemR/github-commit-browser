import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/models/app-settings';
import { NotificationService } from 'src/app/services/notification.service';
import { SettingsService } from 'src/app/services/settings.service';
import { GithubService } from 'src/lib/github/services/github.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  settings: AppSettings;

  constructor(
    private settingsService: SettingsService,
    private githubService: GithubService,
    private notificationService: NotificationService
  ) {
    this.settings = new AppSettings();
  }

  ngOnInit() {}

  save() {
    if (this.settings.clientId && this.settings.clientSecret) {
      this.githubService.setOAuth(this.settings.clientId, this.settings.clientSecret);
    }
    this.settingsService.save(this.settings);
    this.settings = new AppSettings();
    this.notificationService.success('Settings have been saved');
  }

  clearSettings() {
    this.settingsService.clear();
    this.settings = new AppSettings();
    this.githubService.setOAuth(null, null);
    this.notificationService.show('Settings have been cleared');
  }
}
