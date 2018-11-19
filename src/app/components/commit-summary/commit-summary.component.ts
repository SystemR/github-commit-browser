import { Component, Input, OnInit } from '@angular/core';
import { GithubCommit } from 'src/lib/github/models/github-commit';

@Component({
  selector: 'app-commit-summary',
  templateUrl: './commit-summary.component.html',
  styleUrls: ['./commit-summary.component.scss']
})
export class CommitSummaryComponent implements OnInit {
  @Input() commit: GithubCommit;

  constructor() {}

  ngOnInit() {}
}
