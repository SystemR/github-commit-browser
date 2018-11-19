import { Resource } from '@systemr/resource';

export class GithubUser extends Resource {
  id: number;
  login: string;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  site_admin: boolean;
  score: string;
  type: 'User' | 'Organization';

  // Extended Information
  name: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;

  onInstantiated() {
    this.created_at = new Date(this.created_at);
    this.updated_at = new Date(this.updated_at);
  }
}
