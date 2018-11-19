import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SettingsService } from 'src/app/services/settings.service';
import { GithubService } from 'src/lib/github/services/github.service';

import { SettingsPageComponent } from './settings-page.component';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;
  let githubService: GithubService;
  let settingsService: SettingsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPageComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(inject(
    [GithubService, SettingsService],
    (_githubService_: GithubService, _settingsService_: SettingsService) => {
      settingsService = _settingsService_;
      githubService = _githubService_;

      spyOn(settingsService, 'save').and.callFake(() => {});
      spyOn(settingsService, 'clear').and.callFake(() => {});
      spyOn(githubService, 'setOAuth').and.callFake(() => {});
    }
  ));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save', () => {
    component.settings.clientId = 'abc';
    component.settings.clientSecret = 'aaa';
    component.save();

    expect(settingsService.save).toHaveBeenCalled();
    expect(githubService.setOAuth).toHaveBeenCalled();
  });

  it('should clear', () => {
    component.clearSettings();
    expect(githubService.setOAuth).toHaveBeenCalledWith(null, null);
    expect(settingsService.clear).toHaveBeenCalled();
  });
});
