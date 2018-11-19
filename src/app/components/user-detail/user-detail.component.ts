import { Component, Input, OnInit } from '@angular/core';
import { GithubUser } from 'src/lib/github/models/github-user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  @Input() user: GithubUser;
  constructor() {}

  ngOnInit() {}
}
