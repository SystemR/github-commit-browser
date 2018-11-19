import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchType } from 'src/app/models/search-type';
import { NotificationService } from 'src/app/services/notification.service';
import { GithubListResponse } from 'src/lib/github/interfaces/github-interfaces';
import { GithubUser } from 'src/lib/github/models/github-user';
import { GithubService } from 'src/lib/github/services/github.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  isLoading = false;
  queryParams$: Subscription;

  // Query
  q: string;
  type: SearchType;

  // Pagination
  currentPage = 1;
  pageCount = 0;

  users: GithubUser[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private githubService: GithubService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.queryParams$ = this.route.queryParams.subscribe(params => {
      const q = params.q;
      this.q = q;
      if (q) {
        const type = params.type;
        const page = params.page;
        let query;
        if (!type) {
          query = this.githubService.find(q);
        } else if (type === SearchType.user) {
          query = this.githubService.findUsers(q);
        } else if (type === SearchType.org) {
          query = this.githubService.findOrganizations(q);
        }

        if (query) {
          if (page) {
            this.currentPage = +page;
            query.page(page);
          }

          // Do get
          this.isLoading = true;
          query.get().then(
            (result: GithubListResponse<GithubUser>) => {
              this.type = type;
              this.isLoading = false;
              this.pageCount = result.meta.pageCount;
              this.users = result.data;
            },
            (e: HttpErrorResponse) => {
              this.isLoading = false;
              if (e.status === 403) {
                this.notificationService.showApiError(e);
              }
            }
          );
        }
      } else {
        this.users = null;
      }
    });
  }

  ngOnDestroy() {
    this.queryParams$.unsubscribe();
  }

  onPageChange(page: number) {
    this.router.navigate(['/'], {
      queryParams: {
        q: this.q,
        type: this.type,
        page
      }
    });
  }
}
