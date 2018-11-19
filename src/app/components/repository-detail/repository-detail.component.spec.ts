import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GithubRepository } from 'src/lib/github/models/github-repository';

import { RepositoryDetailComponent } from './repository-detail.component';

describe('RepositoryDetailComponent', () => {
  let component: RepositoryDetailComponent;
  let fixture: ComponentFixture<RepositoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RepositoryDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryDetailComponent);
    component = fixture.componentInstance;
    component.repo = new GithubRepository();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
