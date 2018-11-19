import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SearchType } from '../../models/search-type';

@Component({
  selector: 'app-search-user-box',
  templateUrl: './search-user-box.component.html',
  styleUrls: ['./search-user-box.component.scss']
})
export class SearchUserBoxComponent implements OnInit, OnDestroy {
  type = SearchType.all;

  params$: Subscription;

  keyword = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.params$ = this.route.queryParams.subscribe(params => {
      if (params.q) {
        this.keyword = params.q;
      }

      if (params.type) {
        this.setSearchType(params.type);
      }
    });
  }

  ngOnDestroy() {
    this.params$.unsubscribe();
  }

  setSearchType(type: SearchType) {
    this.type = type;
  }

  search() {
    if (this.keyword) {
      const queryParams = {
        q: this.keyword,
        type: this.type !== SearchType.all ? this.type : null
      };

      this.router.navigate(['/'], {
        queryParams
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
