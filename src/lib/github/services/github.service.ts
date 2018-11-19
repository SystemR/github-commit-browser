import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resource } from '@systemr/resource';

import { GithubListResponse } from '../interfaces/github-interfaces';
import { GithubCommit } from '../models/github-commit';
import { GithubRepository } from '../models/github-repository';
import { GithubUser } from '../models/github-user';
import { GithubCommitQuery, GithubUserQuery, GithubUserSearchQuery } from './github-queries';
import { GithubRetrieveType } from './github-retrieve-type';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private githubApiAcceptVersion = 'application/vnd.github.v3+json';
  private userApiUrl = 'https://api.github.com/user/';
  private usersApiUrl = 'https://api.github.com/users/';
  private reposApiUrl = 'https://api.github.com/repos/';
  private repositoriesApiUrl = 'https://api.github.com/repositories/';
  private searchApiUrl = 'https://api.github.com/search/users';

  private usersCache: { [login: string]: GithubUser } = {};
  private userRepositoriesCache: { [userId: number]: GithubRepository[] } = {};
  private repositoriesCache: { [repoName: string]: GithubRepository } = {};

  private clientId: string;
  private clientSecret: string;

  constructor(private http: HttpClient) {}

  setOAuth(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * Builders
   */
  findUsers(keyword: string): GithubUserSearchQuery<GithubUser> {
    return this.find(`${keyword}+type:user`);
  }

  findOrganizations(keyword: string): GithubUserSearchQuery<GithubUser> {
    return this.find(`${keyword}+type:org`);
  }

  find<T extends GithubUser>(keyword): GithubUserSearchQuery<T> {
    return new GithubUserSearchQuery(this.search.bind(this), keyword);
  }

  getRepositories(user: GithubUser): GithubUserQuery<GithubRepository> {
    return new GithubUserQuery<GithubRepository>(
      this.retrieveForUser.bind(this),
      user,
      GithubRetrieveType.repos
    );
  }

  getAllRepositories(user: GithubUser): GithubUserQuery<GithubRepository> {
    return new GithubUserQuery<GithubRepository>(
      this.retrieveAllRepositoriesForUser.bind(this),
      user,
      GithubRetrieveType.repos
    );
  }

  getFollowers(user: GithubUser): GithubUserQuery<GithubUser> {
    return new GithubUserQuery<GithubUser>(
      this.retrieveForUser.bind(this),
      user,
      GithubRetrieveType.followers
    );
  }

  getFollowing(user: GithubUser): GithubUserQuery<GithubUser> {
    return new GithubUserQuery<GithubUser>(
      this.retrieveForUser.bind(this),
      user,
      GithubRetrieveType.following
    );
  }

  getCommits(repo: GithubRepository): GithubCommitQuery<GithubCommit> {
    return new GithubCommitQuery(this.retrieveCommits.bind(this), repo);
  }

  /**
   * Executors
   * These do actual HTTP GET
   */
  search(params: HttpParams): Promise<GithubListResponse<GithubUser>> {
    return new Promise((res, rej) => {
      params = this.appendOAuth(params);
      this.http
        .get(this.searchApiUrl, {
          params,
          observe: 'response',
          headers: {
            Accept: this.githubApiAcceptVersion
          }
        })
        .subscribe(
          (resp: HttpResponse<Object>) => {
            res(this.processGithubSearchUserResultResponse(resp, params));
          },
          err => {
            rej(err);
          }
        );
    });
  }

  retrieveForUser<T extends Resource>(
    user: GithubUser,
    type: GithubRetrieveType,
    params: HttpParams
  ): Promise<GithubListResponse<T>> {
    return new Promise((res, rej) => {
      const endpoint = `${this.userApiUrl}${user.id}/${type}`;
      params = this.appendOAuth(params);
      this.http
        .get(endpoint, {
          params,
          observe: 'response',
          headers: {
            Accept: this.githubApiAcceptVersion
          }
        })
        .subscribe(
          (resp: HttpResponse<Object>) => {
            res(this.processGithubResponse(resp, type, params));
          },
          err => {
            rej(err);
          }
        );
    });
  }

  retrieveAllRepositoriesForUser(
    user: GithubUser,
    type: GithubRetrieveType = GithubRetrieveType.repos,
    params: HttpParams
  ): Promise<GithubListResponse<GithubRepository>> {
    if (this.userRepositoriesCache[user.id]) {
      return Promise.resolve({
        data: this.userRepositoriesCache[user.id],
        meta: {
          pageCount: 1
        }
      } as GithubListResponse<GithubRepository>);
    }
    return new Promise(async (res, rej) => {
      const endpoint = `${this.userApiUrl}${user.id}/${type}`;
      params = this.appendOAuth(params);
      params = params.set('per_page', '100');

      try {
        const result = await this.retrieveRepo(endpoint, params);
        let repos = result.data;
        for (let i = 2; i <= result.meta.pageCount; i++) {
          params = params.set('page', '' + i);
          const nextPageResult = await this.retrieveRepo(endpoint, params);
          repos = repos.concat(nextPageResult.data);
        }

        this.userRepositoriesCache[user.id] = repos;
        result.data = repos;
        result.meta.pageCount = 1;
        res(result);
      } catch (e) {
        rej(e);
      }
    });
  }

  private retrieveRepo(
    endpoint: string,
    params: HttpParams
  ): Promise<GithubListResponse<GithubRepository>> {
    return new Promise((res, rej) => {
      this.http
        .get(endpoint, {
          params,
          observe: 'response',
          headers: {
            Accept: this.githubApiAcceptVersion
          }
        })
        .subscribe(
          (resp: HttpResponse<Object>) => {
            res(this.processGithubResponse(resp, GithubRetrieveType.repos, params));
          },
          err => {
            rej(err);
          }
        );
    });
  }

  retrieveCommits<T extends Resource>(
    repo: GithubRepository,
    params: HttpParams
  ): Promise<GithubListResponse<T>> {
    return new Promise((res, rej) => {
      const endpoint = `${this.repositoriesApiUrl}${repo.id}/commits`;
      params = this.appendOAuth(params);
      this.http
        .get(endpoint, {
          params,
          observe: 'response',
          headers: {
            Accept: this.githubApiAcceptVersion
          }
        })
        .subscribe(
          (resp: HttpResponse<Object>) => {
            res(this.processGithubResponse(resp, GithubRetrieveType.commits, params));
          },
          err => {
            rej(err);
          }
        );
    });
  }

  getUser(login: string): Promise<GithubUser> {
    if (this.usersCache[login]) {
      return Promise.resolve(this.usersCache[login]);
    }

    return new Promise((res, rej) => {
      const endpoint = `${this.usersApiUrl}${login}`;
      let params = new HttpParams();
      params = this.appendOAuth(params);
      this.http
        .get(endpoint, {
          params,
          headers: {
            Accept: this.githubApiAcceptVersion
          }
        })
        .subscribe(
          (resp: GithubUser) => {
            const user = new GithubUser();
            Object.assign(user, resp);

            if (user.onInstantiated) {
              user.onInstantiated();
            }

            this.usersCache[login] = user;
            res(user);
          },
          err => {
            rej(err);
          }
        );
    });
  }

  getRepository(user: GithubUser, repositoryName: string): Promise<GithubRepository> {
    if (this.repositoriesCache[repositoryName]) {
      const repo = this.repositoriesCache[repositoryName];
      if (repo.owner.id === user.id) {
        return Promise.resolve(repo);
      }
    } else if (this.userRepositoriesCache[user.id]) {
      const repositories = this.userRepositoriesCache[user.id];
      for (const repo of repositories) {
        if (repo.name === repositoryName) {
          return Promise.resolve(repo);
        }
      }
    }

    return new Promise((res, rej) => {
      const endpoint = `${this.reposApiUrl}${user.login}/${repositoryName}`;
      let params = new HttpParams();
      params = this.appendOAuth(params);
      this.http
        .get(endpoint, {
          params,
          headers: {
            Accept: this.githubApiAcceptVersion
          }
        })
        .subscribe(
          (resp: GithubRepository) => {
            const repo = new GithubRepository();
            Object.assign(repo, resp);

            if (repo.onInstantiated) {
              repo.onInstantiated();
            }

            this.repositoriesCache[repo.name] = repo;
            res(repo);
          },
          err => {
            rej(err);
          }
        );
    });
  }

  /**
   * Processors
   */
  processGithubResponse<T extends Resource>(
    resp: HttpResponse<Object>,
    type: GithubRetrieveType,
    requestParams: HttpParams
  ): GithubListResponse<T> {
    const result: GithubListResponse<T> = {
      data: [],
      meta: { pageCount: 0 }
    };

    const body = resp.body;
    if (body) {
      result.data = this.getDataFromResponseEntries(body, type);
    }

    const headers = resp.headers;
    if (headers && headers.has('Link')) {
      result.meta.pageCount = this.getPageCount(headers.get('Link'), requestParams);
    } else {
      result.meta.pageCount = 1;
    }
    return result;
  }

  processGithubSearchUserResultResponse<T extends Resource>(
    resp: HttpResponse<Object>,
    requestParams: HttpParams
  ): GithubListResponse<T> {
    const result: GithubListResponse<T> = {
      data: [],
      meta: {
        pageCount: 0
      }
    };

    const body = resp.body;
    if (body) {
      result.meta.count = body['total_count'];
      result.data = this.getDataFromResponseEntries(body['items'], GithubRetrieveType.users);
    }

    const headers = resp.headers;
    if (headers && headers.has('Link')) {
      result.meta.pageCount = this.getPageCount(headers.get('Link'), requestParams);
    } else {
      result.meta.pageCount = 1;
    }
    return result;
  }

  private getDataFromResponseEntries<T extends Resource>(
    entries: any,
    type: GithubRetrieveType
  ): Array<T> {
    const items: Array<T> = [];
    for (const row of entries) {
      const item = this.githubObjectFactory(type);
      if (item) {
        Object.assign(item, row);
        if (item.onInstantiated) {
          item.onInstantiated();
        }
        items.push(item);
      }
    }
    return items;
  }

  private githubObjectFactory(type: GithubRetrieveType): any {
    // Handles instantiating to the correct type
    if (type === GithubRetrieveType.repos) {
      return new GithubRepository();
    } else if (
      type === GithubRetrieveType.followers ||
      type === GithubRetrieveType.users ||
      type === GithubRetrieveType.following
    ) {
      return new GithubUser();
    } else if (type === GithubRetrieveType.commits) {
      return new GithubCommit();
    }
    return null;
  }

  private getPageCount(linkHeader: string, requestParams: HttpParams): number {
    let pageCount = 1;
    const relToPage: { [rel: string]: number } = {};

    // Build rel to page number
    const linksArray = linkHeader.split(', ');
    for (const link of linksArray) {
      const linkArray = link.split('; ');
      const urlPart = linkArray[0];
      const relPart = linkArray[1];
      const relType = relPart.substring(5, relPart.length - 1);
      relToPage[relType] = this.getPageNumFromUrl(urlPart);
    }

    if (relToPage['last']) {
      pageCount = relToPage['last'];
    } else if (relToPage['first']) {
      pageCount = +requestParams.get('page');
    }

    return pageCount;
  }

  private getPageNumFromUrl(url: string): number {
    const paramMatch = url.match(/[&?]page=([0-9]+)/i);
    if (paramMatch) {
      return +paramMatch[1];
    }
    return 1;
  }

  private appendOAuth(params: HttpParams) {
    if (this.clientId && this.clientSecret) {
      params = params.set('client_id', this.clientId);
      params = params.set('client_secret', this.clientSecret);
    }
    return params;
  }
}
