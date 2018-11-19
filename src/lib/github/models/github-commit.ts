import { GithubUser } from './github-user';

export class GithubCommit {
  id: number;
  sha: string;
  node_id: string;
  commit: GithubCommitDetail;
  url: string;
  html_url: string;
  comments_url: string;
  author: GithubUser;
  committer: GithubUser;
  parents: GithubCommit[];
}

export class GithubCommitDetail {
  author: GithubCommitter;
  committer: GithubCommitter;
  message: string;
  tree: GithubCommitTree;
  url: string;
  comment_count: number;
  verification: GithubVerification;
}

export class GithubCommitter {
  name: string;
  email: string;
  date: Date;
}

export class GithubCommitTree {
  sha: string;
  url: string;
}

export class GithubVerification {
  verified: boolean;
  reason: string;
  signature: string;
  payload: string;
}
