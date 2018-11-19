import { HttpParams } from '@angular/common/http';
import { GetQuery, Resource, SearchQuery } from '@systemr/resource';

import { GithubListResponse } from '../interfaces/github-interfaces';
import { GithubRepository } from '../models/github-repository';
import { GithubUser } from '../models/github-user';
import { GithubRetrieveType } from './github-retrieve-type';

/**
 * Search Param Interface
 */
interface SearchParam {
  field: string;
  value: string;
}

export class GithubUserQuery<T extends Resource> extends GetQuery<T> {
  searchParams: Array<SearchParam> = [];

  constructor(
    private handler: Function,
    private user: GithubUser,
    private type: GithubRetrieveType
  ) {
    super(handler);
  }

  where(field: string, value: number | string | Array<number | string>) {
    this.searchParams.push({
      field,
      value: value.toString()
    });
    return this;
  }

  get(): Promise<GithubListResponse<T>> {
    let params: HttpParams = this.getHttpParams();
    for (const searchParam of this.searchParams) {
      params = params.set(searchParam.field, searchParam.value);
    }

    return this.handler(this.user, this.type, params);
  }
}

export class GithubCommitQuery<T extends Resource> extends GetQuery<T> {
  constructor(private handler: Function, private repo: GithubRepository) {
    super(handler);
  }

  get(): Promise<GithubListResponse<T>> {
    const params: HttpParams = this.getHttpParams();
    return this.handler(this.repo, params);
  }
}

export class GithubUserSearchQuery<T extends Resource> extends SearchQuery<T> {
  constructor(private handler: Function, keyword: string) {
    super('q', keyword, handler);
  }

  get(): Promise<GithubListResponse<T>> {
    let params: HttpParams = this.getHttpParams();
    for (const searchParam of this.searchParams) {
      params = params.set(searchParam.field, searchParam.value);
    }
    return this.handler(params);
  }
}
