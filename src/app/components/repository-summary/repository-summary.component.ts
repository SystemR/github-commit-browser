import { Component, Input, OnInit } from '@angular/core';
import { GithubRepository } from 'src/lib/github/models/github-repository';

@Component({
  selector: 'app-repository-summary',
  templateUrl: './repository-summary.component.html',
  styleUrls: ['./repository-summary.component.scss']
})
export class RepositorySummaryComponent implements OnInit {
  @Input() repo: GithubRepository;

  constructor() {}

  ngOnInit() {}
}
