import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GithubCommit, GithubCommitDetail, GithubCommitter } from 'src/lib/github/models/github-commit';
import { GithubUser } from 'src/lib/github/models/github-user';

import { CommitSummaryComponent } from './commit-summary.component';

describe('CommitSummaryComponent', () => {
  let component: CommitSummaryComponent;
  let fixture: ComponentFixture<CommitSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommitSummaryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitSummaryComponent);
    component = fixture.componentInstance;
    const commit = new GithubCommit();
    commit.author = new GithubUser();
    commit.commit = new GithubCommitDetail();
    commit.commit.committer = new GithubCommitter();
    component.commit = commit;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
