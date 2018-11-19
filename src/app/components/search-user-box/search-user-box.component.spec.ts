import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SearchUserBoxComponent } from './search-user-box.component';

describe('SearchUserBoxComponent', () => {
  let component: SearchUserBoxComponent;
  let fixture: ComponentFixture<SearchUserBoxComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchUserBoxComponent],
      imports: [RouterTestingModule, FormsModule, NgbDropdownModule]
    }).compileComponents();
  }));

  beforeEach(inject([Router], (_router_: Router) => {
    router = _router_;

    spyOn(router, 'navigate').and.callFake(() => {});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search', () => {
    component.keyword = 'hello';
    component.search();
    expect(router.navigate).toHaveBeenCalled();
  });
});
