import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import commits from '../../../../sample/commits.json';
import followers from '../../../../sample/followers.json';
import following from '../../../../sample/following.json';
import repositories from '../../../../sample/repositories.json';
import searchOrg from '../../../../sample/search-org.json';
import searchUser from '../../../../sample/search-user.json';
import userInfo from '../../../../sample/user.json';
import { GithubListResponse } from '../interfaces/github-interfaces';
import { GithubCommit } from '../models/github-commit';
import { GithubRepository } from '../models/github-repository';
import { GithubUser } from '../models/github-user';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let httpMock: HttpTestingController;
  let service: GithubService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.get(HttpTestingController);
  });

  beforeEach(inject([Injector], (injector: Injector) => {
    service = TestBed.get(GithubService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Github Search API', () => {
    it('should search user (instantiate results as GithubUser)', async(() => {
      service
        .findUsers('netflix')
        .get()
        .then((result: GithubListResponse<GithubUser>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubUser).toBe(true);
          expect(result.meta.pageCount).toBe(9);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/search/users?q=netflix+type:user',
          method: 'GET'
        })
        .flush(searchUser, {
          headers: {
            Link:
              '<https://api.github.com/search/users?q=netflix+type%3Auser&page=2>; rel="next", <https://api.github.com/search/users?q=netflix+type%3Auser&page=9>; rel="last"'
          }
        });
      httpMock.verify();
    }));

    it('should search organizations (instantiate results as GithubUser)', async(() => {
      service
        .findOrganizations('netflix')
        .get()
        .then((result: GithubListResponse<GithubUser>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubUser).toBe(true);
          expect(result.data[0].type).toBe('Organization');
          expect(result.meta.pageCount).toBe(2);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/search/users?q=netflix+type:org',
          method: 'GET'
        })
        .flush(searchOrg, {
          headers: {
            Link:
              '<https://api.github.com/search/users?q=netflix+type%3Aorg&page=2>; rel="next", <https://api.github.com/search/users?q=netflix+type%3Aorg&page=2>; rel="last"'
          }
        });
      httpMock.verify();
    }));

    it('should search user with OAuth (to increase rate limit)', async(() => {
      service.setOAuth('clientId', 'clientSecret');

      service
        .findUsers('netflix')
        .get()
        .then((result: GithubListResponse<GithubUser>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubUser).toBe(true);
          expect(result.meta.pageCount).toBe(9);
        });

      httpMock
        .expectOne({
          url:
            'https://api.github.com/search/users?q=netflix+type:user&client_id=clientId&client_secret=clientSecret',
          method: 'GET'
        })
        .flush(searchUser, {
          headers: {
            Link:
              '<https://api.github.com/search/users?q=netflix+type%3Auser&page=2>; rel="next", <https://api.github.com/search/users?q=netflix+type%3Auser&page=9>; rel="last"'
          }
        });
      httpMock.verify();
    }));
  });

  describe('Github User API', () => {
    it('should get user detail /:login', async(() => {
      service.getUser('SystemR').then(
        (user: GithubUser) => {
          expect(user instanceof GithubUser).toBe(true);
        },
        _ => {
          throw new Error('Should not reject');
        }
      );
      httpMock
        .expectOne({
          url: 'https://api.github.com/users/SystemR',
          method: 'GET'
        })
        .flush(userInfo);
      httpMock.verify();
    }));

    it('should get repos given a user with paging', async(() => {
      const user = new GithubUser();
      user.id = 272534;
      user.login = 'SystemR';

      service
        .getRepositories(user)
        .page(2)
        .get()
        .then((result: GithubListResponse<GithubRepository>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubRepository).toBe(true);
          expect(result.meta.pageCount).toBe(3);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/user/272534/repos?page=2',
          method: 'GET'
        })
        .flush(repositories, {
          headers: {
            Link:
              '<https://api.github.com/user/272534/repos?page=1>; rel="prev", <https://api.github.com/user/272534/repos?page=3>; rel="next", <https://api.github.com/user/272534/repos?page=3>; rel="last"'
          }
        });
      httpMock.verify();
    }));

    it('should get repos given a user with paging, last page', async(() => {
      const user = new GithubUser();
      user.id = 272534;
      user.login = 'SystemR';

      service
        .getRepositories(user)
        .page(2)
        .get()
        .then((result: GithubListResponse<GithubRepository>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubRepository).toBe(true);
          expect(result.meta.pageCount).toBe(2);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/user/272534/repos?page=2',
          method: 'GET'
        })
        .flush(repositories, {
          headers: {
            Link:
              '<https://api.github.com/user/272534/repos?page=1>; rel="prev", <https://api.github.com/user/272534/repos?page=2>; rel="last"'
          }
        });
      httpMock.verify();
    }));

    it('should get repos given a user with paging out of bounds (page 6 when max is 5)', async(() => {
      const user = new GithubUser();
      user.id = 913567;
      user.login = 'Netflix';

      service
        .getRepositories(user)
        .page(6)
        .get()
        .then((result: GithubListResponse<GithubRepository>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubRepository).toBe(true);
          expect(result.meta.pageCount).toBe(5);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/user/913567/repos?page=6',
          method: 'GET'
        })
        .flush(repositories, {
          headers: {
            Link:
              '<https://api.github.com/user/913567/repos?page=5>; rel="prev", <https://api.github.com/user/913567/repos?page=5>; rel="last", <https://api.github.com/user/913567/repos?page=1>; rel="first"'
          }
        });
      httpMock.verify();
    }));

    it('should get all repos given a user (auto traverse to all pages)', fakeAsync(() => {
      const user = new GithubUser();
      user.id = 272534;
      user.login = 'SystemR';

      service
        .getAllRepositories(user)
        .get()
        .then(
          (result: GithubListResponse<GithubRepository>) => {
            // Fake response is 3 pages, so 300
            expect(result.data.length).toBe(300);
            expect(result.data[0] instanceof GithubRepository).toBe(true);
            expect(result.meta.pageCount).toBe(1);
          },
          _ => {
            throw new Error('Should not reject');
          }
        );

      // Page 1
      httpMock
        .expectOne({
          url: 'https://api.github.com/user/272534/repos?per_page=100',
          method: 'GET'
        })
        .flush(repositories, {
          headers: {
            Link:
              '<https://api.github.com/user/272534/repos?per_page=100&page=3>; rel="next", <https://api.github.com/user/272534/repos?per_page=100&page=3>; rel="last"'
          }
        });
      tick();

      // Page 2
      httpMock
        .expectOne({
          url: 'https://api.github.com/user/272534/repos?per_page=100&page=2',
          method: 'GET'
        })
        .flush(repositories, {
          headers: {
            Link:
              '<https://api.github.com/user/272534/repos?per_page=100&page=1>; rel="prev", <https://api.github.com/user/272534/repos?per_page=100&page=3>; rel="next", <https://api.github.com/user/272534/repos?per_page=100&page=3>; rel="last"'
          }
        });
      tick();

      // Page 3
      httpMock
        .expectOne({
          url: 'https://api.github.com/user/272534/repos?per_page=100&page=3',
          method: 'GET'
        })
        .flush(repositories, {
          headers: {
            Link:
              '<https://api.github.com/user/272534/repos?per_page=100&page=2>; rel="prev", <https://api.github.com/user/272534/repos?per_page=100&page=1>; rel="first"'
          }
        });

      httpMock.verify();
    }));

    it('should get followers given a user', async(() => {
      const user = new GithubUser();
      user.id = 272534;
      user.login = 'SystemR';

      service
        .getFollowers(user)
        .get()
        .then((result: GithubListResponse<GithubUser>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubUser).toBe(true);
          expect(result.meta.pageCount).toBe(1);
        });
      httpMock
        .expectOne({
          url: 'https://api.github.com/user/272534/followers',
          method: 'GET'
        })
        .flush(followers);
      httpMock.verify();
    }));

    it('should get followers (or repo, following, etc) given a user with paging', async(() => {
      const user = new GithubUser();
      user.id = 272534;
      user.login = 'SystemR';

      service
        .getFollowers(user)
        .page(2)
        .get()
        .then((result: GithubListResponse<GithubUser>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubUser).toBe(true);
          expect(result.meta.pageCount).toBe(1);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/user/272534/followers?page=2',
          method: 'GET'
        })
        .flush(followers, {
          headers: {
            Link:
              '<https://api.github.com/user/272534/followers?page=1>; rel="prev", <https://api.github.com/user/272534/followers?page=1>; rel="last", <https://api.github.com/user/272534/followers?page=1>; rel="first"'
          }
        });
      httpMock.verify();
    }));

    it('should get followers (or repo, following, etc) given a user with paging, multiple pages', async(() => {
      const user = new GithubUser();
      user.id = 913567;
      user.login = 'Netflix';

      service
        .getFollowers(user)
        .page(3)
        .get()
        .then((result: GithubListResponse<GithubUser>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubUser).toBe(true);
          expect(result.meta.pageCount).toBe(5);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/user/913567/followers?page=3',
          method: 'GET'
        })
        .flush(followers, {
          headers: {
            Link:
              '<https://api.github.com/user/913567/followers?page=2>; rel="prev", <https://api.github.com/user/913567/followers?page=4>; rel="next", <https://api.github.com/user/913567/followers?page=5>; rel="last"'
          }
        });
      httpMock.verify();
    }));

    it('should get followers (or repo, following, etc) given a user with paging, on last page', async(() => {
      const user = new GithubUser();
      user.id = 913567;
      user.login = 'Netflix';

      service
        .getFollowers(user)
        .page(5)
        .get()
        .then((result: GithubListResponse<GithubUser>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubUser).toBe(true);
          expect(result.meta.pageCount).toBe(5);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/user/913567/followers?page=5',
          method: 'GET'
        })
        .flush(followers, {
          headers: {
            Link:
              '<https://api.github.com/user/913567/followers?page=4>; rel="prev", <https://api.github.com/user/913567followers?page=1>; rel="first"'
          }
        });
      httpMock.verify();
    }));

    it('should get followers (or repo, following, etc) given a user with paging out of bounds (page 6 when max is 5)', async(() => {
      const user = new GithubUser();
      user.id = 913567;
      user.login = 'Netflix';

      service
        .getFollowers(user)
        .page(6)
        .get()
        .then((result: GithubListResponse<GithubUser>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubUser).toBe(true);
          expect(result.meta.pageCount).toBe(5);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/user/913567/followers?page=6',
          method: 'GET'
        })
        .flush(followers, {
          headers: {
            Link:
              '<https://api.github.com/user/913567/followers?page=5>; rel="prev", <https://api.github.com/user/913567followers?page=5>; rel="last", <https://api.github.com/user/913567/followers?page=1>; rel="first"'
          }
        });
      httpMock.verify();
    }));

    it('should get user\'s following', async(() => {
      const user = new GithubUser();
      user.id = 272534;
      user.login = 'SystemR';

      service
        .getFollowing(user)
        .get()
        .then((result: GithubListResponse<GithubUser>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubUser).toBe(true);
          expect(result.meta.pageCount).toBe(1);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/user/272534/following',
          method: 'GET'
        })
        .flush(following);
      httpMock.verify();
    }));
  });

  describe('Github Repo API', () => {
    it('should get repo detail', async(() => {
      const user = new GithubUser();
      user.id = 272534;
      user.login = 'SystemR';

      service.getRepository(user, 'resource-service').then(
        (repo: GithubRepository) => {
          expect(repo instanceof GithubRepository).toBe(true);
        },
        _ => {
          throw new Error('Should not reject');
        }
      );
      httpMock
        .expectOne({
          url: 'https://api.github.com/repos/SystemR/resource-service',
          method: 'GET'
        })
        .flush(userInfo);
      httpMock.verify();
    }));

    it('should get commits given a repo', async(() => {
      const repo = new GithubRepository();
      repo.id = 13601636;
      repo.name = 'aegisthus';

      service
        .getCommits(repo)
        .get()
        .then((result: GithubListResponse<GithubCommit>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubCommit).toBe(true);
          expect(result.meta.pageCount).toBe(5);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/repositories/13601636/commits',
          method: 'GET'
        })
        .flush(commits, {
          headers: {
            Link:
              '<https://api.github.com/repositories/13601636/commits?page=2>; rel="next", <https://api.github.com/repositories/13601636/commits?page=5>; rel="last"'
          }
        });
      httpMock.verify();
    }));

    it('should get commits given a repo with paging', async(() => {
      const repo = new GithubRepository();
      repo.id = 13601636;
      repo.name = 'aegisthus';

      service
        .getCommits(repo)
        .page(2)
        .get()
        .then((result: GithubListResponse<GithubCommit>) => {
          expect(result.data.length).toBeGreaterThan(1);
          expect(result.data[0] instanceof GithubCommit).toBe(true);
          expect(result.meta.pageCount).toBe(5);
        });

      httpMock
        .expectOne({
          url: 'https://api.github.com/repositories/13601636/commits?page=2',
          method: 'GET'
        })
        .flush(commits, {
          headers: {
            Link:
              '<https://api.github.com/repositories/13601636/commits?page=3>; rel="next", <https://api.github.com/repositories/13601636/commits?page=5>; rel="last", <https://api.github.com/repositories/13601636/commits?page=1>; rel="first", <https://api.github.com/repositories/13601636/commits?page=1>; rel="prev"'
          }
        });
      httpMock.verify();
    }));
  });
});
