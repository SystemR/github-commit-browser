import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { RepositorySummaryComponent } from 'src/app/components/repository-summary/repository-summary.component';
import { UserDetailComponent } from 'src/app/components/user-detail/user-detail.component';
import { GithubRepository } from 'src/lib/github/models/github-repository';

import { SortType, UserPageComponent } from './user-page.component';

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserPageComponent,
        PaginationComponent,
        UserDetailComponent,
        RepositorySummaryComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        NgbDropdownModule,
        ToastrModule.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort repositories by full name', () => {
    const one = new GithubRepository();
    one.full_name = 'a';
    const two = new GithubRepository();
    two.full_name = 'b';
    const three = new GithubRepository();
    three.full_name = 'c';
    component.repositories = [one, three, two];
    component.sort = SortType.full_name;
    component.sortRepositories();

    expect(component.repositories[0]).toBe(one);
    expect(component.repositories[1]).toBe(two);
    expect(component.repositories[2]).toBe(three);
  });

  it('should sort repositories by forks', () => {
    const one = new GithubRepository();
    one.full_name = 'a';
    one.forks_count = 1;
    const two = new GithubRepository();
    two.full_name = 'b';
    two.forks_count = 2;
    const three = new GithubRepository();
    three.full_name = 'c';
    three.forks_count = 3;
    component.repositories = [one, three, two];
    component.sort = SortType.forks_count;
    component.sortRepositories();

    expect(component.repositories[0]).toBe(three);
    expect(component.repositories[1]).toBe(two);
    expect(component.repositories[2]).toBe(one);
  });

  it('should sort repositories by stargazers', () => {
    const one = new GithubRepository();
    one.full_name = 'a';
    one.stargazers_count = 1;
    const two = new GithubRepository();
    two.full_name = 'b';
    two.stargazers_count = 2;
    const three = new GithubRepository();
    three.full_name = 'c';
    three.stargazers_count = 3;
    component.repositories = [one, three, two];
    component.sort = SortType.stargazers_count;
    component.sortRepositories();

    expect(component.repositories[0]).toBe(three);
    expect(component.repositories[1]).toBe(two);
    expect(component.repositories[2]).toBe(one);
  });
});
