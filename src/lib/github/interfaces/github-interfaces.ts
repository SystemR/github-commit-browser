import { ListResponse, Resource, ResponseMeta } from '@systemr/resource';

export interface GithubListResponse<T extends Resource>
  extends ListResponse<T> {
  meta: GithubResponseMeta;
}

export interface GithubResponseMeta extends ResponseMeta {
  pageCount: number;
}
