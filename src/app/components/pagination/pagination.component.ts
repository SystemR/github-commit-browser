import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

const MAX_SHOWN = 6; // Has to be even numbered

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() page: number;
  @Input() pageCount: number;
  @Input() maxShown = MAX_SHOWN;
  @Output() pageChange = new EventEmitter<number>();

  pages: Array<number> = [];
  isEllipsesLeftShown = false;
  isEllipsesRightShown = false;

  ngOnInit() {
    this.updatePages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pageCount) {
      this.updatePages();
    }
  }

  private hasEllipsesLeft() {
    return this.page > this.maxShown / 2 + 1;
  }

  private hasEllipsesRight() {
    return this.pageCount - this.page > this.maxShown / 2;
  }

  updatePages() {
    const page = this.page;
    const pageCount = this.pageCount;

    // To update
    const pages = [];
    let isEllipsesLeftShown = false;
    let isEllipsesRightShown = false;

    if (pageCount <= this.maxShown + 1) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      isEllipsesLeftShown = this.hasEllipsesLeft();
      isEllipsesRightShown = this.hasEllipsesRight();

      // Generate visible page numbers
      for (let i = 0; i < this.maxShown; i++) {
        const current = page - this.maxShown / 2 + i;
        if (current >= 1 && current <= pageCount) {
          pages.push(current);
        }
      }

      // Handle right side
      let pagesLength = pages.length;
      if (pagesLength < this.maxShown) {
        let toAppend = this.maxShown;
        if (isEllipsesLeftShown) {
          toAppend--;
        } else {
          toAppend++;
        }

        if (isEllipsesRightShown) {
          toAppend--;
        }

        for (let i = pagesLength; i < toAppend; i++) {
          const ptr = pages[i - 1] + 1;
          if (ptr <= pageCount) {
            pages.push(ptr);
          }
        }
      } else if (!isEllipsesRightShown) {
        const addToPage = pages[pagesLength - 1] + 1;
        if (addToPage <= pageCount) {
          pages.push(pageCount);
        }
      }

      // Handle left side
      pagesLength = pages.length;
      const remaining = this.maxShown - pagesLength;
      if (remaining > 0) {
        const start = pages[0];
        for (let i = 1; i <= remaining; i++) {
          const toAdd = start - i;
          pages.unshift(toAdd);
        }
      } else if ((isEllipsesLeftShown && isEllipsesRightShown) || remaining < 0) {
        pages.shift();
      }
    }

    // Commit changes
    this.isEllipsesLeftShown = isEllipsesLeftShown;
    this.isEllipsesRightShown = isEllipsesRightShown;
    this.pages = pages;
  }

  selectPage(newPage: number) {
    if (newPage !== this.page && newPage > 0 && newPage <= this.pageCount) {
      this.page = newPage;
      this.pageChange.emit(this.page);
      this.updatePages();
    }
  }
}
