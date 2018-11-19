import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { from } from 'rxjs';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { UserSummaryComponent } from 'src/app/components/user-summary/user-summary.component';
import { GithubService } from 'src/lib/github/services/github.service';

import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let githubService: GithubService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePageComponent, PaginationComponent, UserSummaryComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: from([{ q: 'SystemR', page: 2 }])
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(inject([GithubService, Router], (_githubService_: GithubService, _router_: Router) => {
    githubService = _githubService_;
    router = _router_;
    spyOn(githubService, 'find').and.callFake(() => {});
    spyOn(router, 'navigate').and.callFake(() => {});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call github', () => {
    expect(githubService.find).toHaveBeenCalled();
  });

  it('should handle page change', () => {
    component.onPageChange(10);
    expect(router.navigate).toHaveBeenCalled();
  });
});
