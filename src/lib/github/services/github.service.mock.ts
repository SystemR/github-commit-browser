import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resource } from '@systemr/resource';

import commits from '../../../../sample/commits.json';
import followers from '../../../../sample/followers.json';
import following from '../../../../sample/following.json';
import repositories from '../../../../sample/repositories.json';
import repositoryInfo from '../../../../sample/repository.json';
import searchOrg from '../../../../sample/search-org.json';
import userInfo from '../../../../sample/user.json';
import { GithubListResponse } from '../interfaces/github-interfaces';
import { GithubRepository } from '../models/github-repository';
import { GithubUser } from '../models/github-user';
import { GithubRetrieveType } from './github-retrieve-type';
import { GithubService } from './github.service';

@Injectable({
  providedIn: 'root'
})
export class GithubServiceMock extends GithubService {
  constructor(http: HttpClient) {
    super(http);
  }

  search(params: HttpParams): Promise<GithubListResponse<GithubUser>> {
    return Promise.resolve(
      this.processGithubSearchUserResultResponse({ body: searchOrg } as HttpResponse<any>, params)
    );
  }

  retrieveForUser<T extends Resource>(
    user: GithubUser,
    type: GithubRetrieveType,
    params: HttpParams
  ): Promise<GithubListResponse<T>> {
    if (type === GithubRetrieveType.repos) {
      return Promise.resolve(
        this.processGithubResponse(
          {
            body: repositories
          } as HttpResponse<any>,
          type,
          params
        )
      );
    } else if (type === GithubRetrieveType.followers) {
      return Promise.resolve(
        this.processGithubResponse(
          {
            body: followers
          } as HttpResponse<any>,
          type,
          params
        )
      );
    } else if (type === GithubRetrieveType.following) {
      return Promise.resolve(
        this.processGithubResponse({ body: following } as HttpResponse<any>, type, params)
      );
    }
  }

  retrieveAllRepositoriesForUser<T extends Resource>(
    user: GithubUser,
    type: GithubRetrieveType,
    params: HttpParams
  ): Promise<GithubListResponse<T>> {
    return Promise.resolve(
      this.processGithubResponse(
        {
          body: repositories
        } as HttpResponse<any>,
        type,
        params
      )
    );
  }

  retrieveCommits<T extends Resource>(
    repo: GithubRepository,
    params: HttpParams
  ): Promise<GithubListResponse<T>> {
    return Promise.resolve(
      this.processGithubResponse(
        {
          body: commits
        } as HttpResponse<any>,
        GithubRetrieveType.commits,
        params
      )
    );
  }

  getUser(login: string): Promise<GithubUser> {
    return new Promise((res, rej) => {
      const user = new GithubUser();
      Object.assign(user, userInfo);

      if (user.onInstantiated) {
        user.onInstantiated();
      }
      res(user);
    });
  }

  getRepository(user: GithubUser, repositoryName: string): Promise<GithubRepository> {
    return new Promise((res, rej) => {
      const repo = new GithubRepository();
      Object.assign(repo, repositoryInfo);

      if (repo.onInstantiated) {
        repo.onInstantiated();
      }
      res(repo);
    });
  }
}
