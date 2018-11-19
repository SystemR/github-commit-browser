import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { from } from 'rxjs';
import { GithubRepository } from 'src/lib/github/models/github-repository';
import { GithubUser } from 'src/lib/github/models/github-user';
import { GithubService } from 'src/lib/github/services/github.service';

import { CommitSummaryComponent } from '../../components/commit-summary/commit-summary.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { RepositoryDetailComponent } from '../../components/repository-detail/repository-detail.component';
import { RepositoryPageComponent } from './repository-page.component';

describe('RepositoryPageComponent', () => {
  let component: RepositoryPageComponent;
  let fixture: ComponentFixture<RepositoryPageComponent>;
  let githubService: GithubService;
  let router: Router;

  let user: GithubUser;
  let repo: GithubRepository;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RepositoryPageComponent,
        CommitSummaryComponent,
        PaginationComponent,
        RepositoryDetailComponent
      ],
      imports: [
        NgbModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{ login: 'SystemR', repo: 'resource-service' }]),
            queryParams: from([{ page: 2 }])
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(inject([GithubService, Router], (_githubService_: GithubService, _router_: Router) => {
    githubService = _githubService_;
    router = _router_;

    user = new GithubUser();
    user.login = 'SystemR';

    repo = new GithubRepository();
    repo.name = 'resource-service';

    spyOn(githubService, 'getUser').and.returnValue(Promise.resolve(user));
    spyOn(githubService, 'getRepository').and.callFake(() => {});
    spyOn(githubService, 'getCommits').and.callFake(() => {});
    spyOn(router, 'navigate').and.callFake(() => {});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call github', () => {
    fixture.whenStable().then(() => {
      expect(githubService.getUser).toHaveBeenCalledWith(user.login);
      expect(githubService.getRepository).toHaveBeenCalledWith(user, repo.name);
      expect(githubService.getCommits).toHaveBeenCalled();
    });
  });

  it('should handle page change', () => {
    const user = new GithubUser();
    user.login = 'SystemR';
    const repo = new GithubRepository();
    repo.full_name = 'resource-service';
    component.user = user;
    component.repo = repo;
    component.onPageChange(10);
    expect(router.navigate).toHaveBeenCalled();
  });
});
