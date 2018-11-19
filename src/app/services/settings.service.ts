import { Injectable } from '@angular/core';

import { AppSettings } from '../models/app-settings';

const APP_SETTINGS_LOCAL_STORAGE_KEY = 'RW_APP';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings: AppSettings;

  constructor() {
    this.settings = new AppSettings();
    const data = localStorage.getItem(APP_SETTINGS_LOCAL_STORAGE_KEY);
    if (data) {
      try {
        const jsonSettings = JSON.parse(atob(data));
        Object.assign(this.settings, jsonSettings);
      } catch (e) {
        this.clear();
      }
    }
  }

  get(): AppSettings {
    return this.settings;
  }

  clear() {
    localStorage.removeItem(APP_SETTINGS_LOCAL_STORAGE_KEY);
    for (const prop in this.settings) {
      this.settings[prop] = null;
    }
  }

  save(settings: AppSettings) {
    Object.assign(this.settings, settings);
    const encoded = btoa(JSON.stringify(settings));
    localStorage.setItem(APP_SETTINGS_LOCAL_STORAGE_KEY, encoded);
  }
}
