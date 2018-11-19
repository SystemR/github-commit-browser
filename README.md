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

I ended up re-using a library that I open sourced recently here: [https://github.com/SystemR/resource-service](https://github.com/SystemR/resource-service). Using this allows me to communicate with a REST API similar to ORM. The downside is that, Github's URL path are quite nested which enforces me to tweak a few things from the base library.
