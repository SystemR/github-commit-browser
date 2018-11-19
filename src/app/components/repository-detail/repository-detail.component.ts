import { Component, Input, OnInit } from '@angular/core';
import { GithubRepository } from 'src/lib/github/models/github-repository';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html',
  styleUrls: ['./repository-detail.component.scss']
})
export class RepositoryDetailComponent implements OnInit {
  @Input() repo: GithubRepository;

  constructor() {}

  ngOnInit() {}
}
