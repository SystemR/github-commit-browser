# GithubCommitBrowser

## Setup

To run the application:

```sh
$ npm install
$ npm start
```

## Testing

Run tests by doing:

```sh
$ npm run test
```

## Requirements:

- Display commits of a repository
- Display a list of repositories for a user/organization
- Sort repository based on some attributes
- Filter repository based on names or description
- Search a user/organization
- Github Integration
- Github Data Modelling

## Notes

Based on the requirements I think the bulk of the work would be the integration with Github. Once the data models for Github User, Repo, Commits, and the services to call the API are there, building the UI is trivial.

I wanted to re-use a library that I recently open sourced here: [https://github.com/SystemR/resource-service](https://github.com/SystemR/resource-service). Using this allows me to communicate with a REST API similar to using an ORM (building the page or sort parameter), and the library has been unit tested which reduces the amount of work for this project.

### Observations

- Github's API URL paths are quite nested.  
  Although I can re-use a lot from ResourceService library I created, the GithubService for this code requires a bit of a tweak to make it work with the nested URL paths.

- Github's API can be JSON hijacked on older browser:  
  [https://dev.to/antogarand/why-facebooks-api-starts-with-a-for-loop-1eob](https://dev.to/antogarand/why-facebooks-api-starts-with-a-for-loop-1eob). Luckily Github does not have 3rd party scripts, nor does its users would ever copy and paste codes into dev tools console to load 3rd party scripts (as some Facebook users would).

- API inconsistencies  
  On some API such as Search, Github returns total count and whether the search timed out (incomplete_results flag). I think they should enforce consistency and have the same structure for better processing and typing on the front-end.
