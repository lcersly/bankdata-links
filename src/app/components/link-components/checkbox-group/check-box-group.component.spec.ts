import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckBoxGroupComponent} from './check-box-group.component';

describe('ChipsWithAutocompleteComponent', () => {
  let component: CheckBoxGroupComponent;
  let fixture: ComponentFixture<CheckBoxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckBoxGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBoxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
