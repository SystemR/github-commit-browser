import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SearchUserBoxComponent } from './search-user-box.component';

describe('SearchUserBoxComponent', () => {
  let component: SearchUserBoxComponent;
  let fixture: ComponentFixture<SearchUserBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchUserBoxComponent],
      imports: [RouterTestingModule, FormsModule, NgbDropdownModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
