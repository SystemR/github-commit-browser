import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterableComponent } from 'src/app/components/core/filterable-component';
import { NotificationService } from 'src/app/services/notification.service';
import { GithubCommit } from 'src/lib/github/models/github-commit';
import { GithubRepository } from 'src/lib/github/models/github-repository';
import { GithubUser } from 'src/lib/github/models/github-user';
import { GithubService } from 'src/lib/github/services/github.service';

@Component({
  selector: 'app-repository-page',
  templateUrl: './repository-page.component.html',
  styleUrls: ['./repository-page.component.scss']
})
export class RepositoryPageComponent extends FilterableComponent<GithubCommit>
  implements OnInit, OnDestroy {
  isLoading = true;
  params$: Subscription;

  user: GithubUser;
  repo: GithubRepository;
  commits: GithubCommit[];

  currentPage = 1;
  pageCount = 1;

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
        const repositoryName = param.repo;
        const page = queryParams.page;
        this.error = '';
        try {
          const user = await this.githubService.getUser(userLogin);
          this.user = user;

          const repo = await this.githubService.getRepository(user, repositoryName);
          this.repo = repo;

          const query = this.githubService.getCommits(repo);
          if (page) {
            this.currentPage = +page;
            query.page(page);
          }
          const result = await query.get();
          this.commits = result.data;
          this.pageCount = result.meta.pageCount;

          this.isLoading = false;
        } catch (e) {
          if (e.status === 404) {
            this.router.navigate(['/', userLogin]);
          } else if (e.status === 403) {
            this.error = 'You have reached API Rate limit';
            this.notificationService.showApiError(e);
          } else {
            this.error = 'An unknown error has occured :(';
          }
        }
      });
  }

  ngOnDestroy() {
    this.params$.unsubscribe();
  }

  filter() {
    if (this.searchFilter) {
      const keyword = this.searchFilter.toLowerCase();
      this.filtered = this.commits.filter(dataRow => {
        if (
          this.isMatch(dataRow['commit'], this.searchFilter) ||
          this.isMatch(dataRow['author'], this.searchFilter) ||
          this.isMatch(dataRow['sha'], this.searchFilter)
        ) {
          return true;
        }

        return false;
      });
    }
  }

  onPageChange(page: number) {
    this.router.navigate(['/', this.user.login, this.repo.name], {
      queryParams: {
        page
      }
    });
  }
}
