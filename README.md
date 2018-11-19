# GithubCommitBrowser

## Requirements:

- Display commits of a repository
- Display a list of repositories for a user/organization
- Sort repository based on some attributes
- Filter repository based on names or description
- Search a user/organization
- Github Integration
- Github Data Modelling

## Notes

Based on the requirements I think the bulk of the work would be the integration with Github. Once the data models for Github and the services that do API calls are there, building the UI is trivial.

I wanted to re-use a library that I open sourced recently here: [https://github.com/SystemR/resource-service](https://github.com/SystemR/resource-service). Using this allows me to communicate with a REST API similar to ORM and it's also been unit tested. Since some of Github's URL paths are quite nested, I had to create a service that's a bit specific to GitHub.

### Observations

- Github's API can be JSON hijacked on older browser:  
  [https://dev.to/antogarand/why-facebooks-api-starts-with-a-for-loop-1eob](https://dev.to/antogarand/why-facebooks-api-starts-with-a-for-loop-1eob). Luckily Github does not have 3rd party scripts, nor does its users would ever copy and paste codes into dev tools console to load 3rd party scripts (as some Facebook users would).

- API inconsistencies  
  On some API such as Search, Github returns total count and whether the search timed out (incomplete_results flag). I think they should enforce consistency and have the same structure for better processing and typing on the front-end.
