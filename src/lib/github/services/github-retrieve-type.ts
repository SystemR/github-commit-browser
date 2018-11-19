// The following are types to data that users own, also mapped to the data models
export enum GithubRetrieveType {
  repos = 'repos',
  users = 'users',
  commits = 'commits',
  followers = 'followers',
  following = 'following'

  // Not mapped to a data model yet. For example:
  // gists = 'gists'
  // events = 'events'
  // received_events = 'received_events'
}
