import { Component, Input, OnInit } from '@angular/core';
import { GithubUser } from 'src/lib/github/models/github-user';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss']
})
export class UserSummaryComponent implements OnInit {
  @Input() user: GithubUser;

  constructor() {}

  ngOnInit() {}
}
