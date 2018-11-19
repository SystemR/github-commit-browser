import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GithubRepository } from 'src/lib/github/models/github-repository';

import { RepositorySummaryComponent } from './repository-summary.component';

describe('RepositorySummaryComponent', () => {
  let component: RepositorySummaryComponent;
  let fixture: ComponentFixture<RepositorySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RepositorySummaryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositorySummaryComponent);
    component = fixture.componentInstance;
    component.repo = new GithubRepository();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
