import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { GithubService } from 'src/lib/github/services/github.service';

import { AppComponent } from './app.component';
import { SearchUserBoxComponent } from './components/search-user-box/search-user-box.component';
import { AppSettings } from './models/app-settings';
import { SettingsService } from './services/settings.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let githubService: GithubService;
  let settingsService: SettingsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [AppComponent, SearchUserBoxComponent]
    }).compileComponents();
  }));

  beforeEach(inject(
    [GithubService, SettingsService],
    (_githubService_: GithubService, _settingsService_: SettingsService) => {
      settingsService = _settingsService_;
      githubService = _githubService_;

      const settings = new AppSettings();
      settings.clientId = 'a';
      settings.clientSecret = 'b';

      spyOn(settingsService, 'get').and.returnValue(settings);
      spyOn(githubService, 'setOAuth').and.callFake(() => {});
    }
  ));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should get settings', () => {
    expect(settingsService.get).toHaveBeenCalled();
    expect(githubService.setOAuth).toHaveBeenCalled();
  });
});
