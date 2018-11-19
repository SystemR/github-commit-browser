import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterableComponent } from 'src/app/components/core/filterable-component';
import { NotificationService } from 'src/app/services/notification.service';
import { GithubRepository } from 'src/lib/github/models/github-repository';
import { GithubUser } from 'src/lib/github/models/github-user';
import { GithubService } from 'src/lib/github/services/github.service';

export enum SortType {
  full_name = 'full_name',
  forks_count = 'forks_count',
  stargazers_count = 'stargazers_count'
}

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent extends FilterableComponent<GithubRepository>
  implements OnInit, OnDestroy {
  isLoading = true;
  params$: Subscription;

  user: GithubUser;
  repositories: GithubRepository[];
  filtered: GithubRepository[];

  sort = SortType.forks_count;

  error: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private githubService: GithubService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.params$ = combineLatest(this.route.queryParams, this.route.params)
      .pipe(
        map(results => ({
          queryParams: results[0],
          params: results[1]
        }))
      )
      .subscribe(async allParams => {
        const queryParams = allParams.queryParams;
        const param = allParams.params;
        const userLogin = param.login;
        this.error = '';

        if (queryParams.sort) {
          this.sort = queryParams.sort;
        }

        let user;
        try {
          user = await this.githubService.getUser(userLogin);
          this.user = user;
        } catch (e) {
          if (e.status === 404) {
            this.error = 'Looks like user doesn\'t exist.';
          } else if (e.status === 403) {
            this.error = 'You have reached API Rate limit.';
            this.notificationService.showApiError(e);
          } else {
            this.error = 'An unknown error has occured :(';
          }
        }

        if (user) {
          try {
            const result = await this.githubService.getAllRepositories(user).get();
            this.repositories = result.data;
            this.sortRepositories();
          } catch (e) {
            if (e.status === 403) {
              this.error = 'You have reached API Rate limit';
              this.notificationService.showApiError(e);
            } else {
              this.error = 'An unknown error has occured :(';
            }
          }
        }

        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.params$.unsubscribe();
  }

  setSort(sort: SortType) {
    this.router.navigate(['/', this.user.login], {
      queryParams: {
        sort: sort
      }
    });
  }

  filter() {
    if (this.searchFilter) {
      const keyword = this.searchFilter.toLowerCase();
      this.filtered = this.repositories.filter(dataRow => {
        if (
          this.isMatch(dataRow['full_name'], keyword) ||
          this.isMatch(dataRow['description'], keyword)
        ) {
          return true;
        }

        return false;
      });
    }
  }

  sortRepositories() {
    if (this.sort === SortType.full_name) {
      this.repositories.sort(this.stringSort.bind(this));
    } else {
      this.repositories.sort(this.numSort.bind(this));
    }
  }

  private stringSort(a, b) {
    const aVal = a[this.sort].toLowerCase();
    const bVal = b[this.sort].toLowerCase();
    if (aVal < bVal) {
      return -1;
    } else if (aVal > bVal) {
      return 1;
    }
    return 0;
  }

  private numSort(a, b) {
    const aVal = a[this.sort];
    const bVal = b[this.sort];
    if (aVal < bVal) {
      return 1;
    } else if (aVal > bVal) {
      return -1;
    }
    return 0;
  }
}
