import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChipsWithAutocompleteComponent} from './chips-with-autocomplete.component';

describe('ChipsWithAutocompleteComponent', () => {
  let component: ChipsWithAutocompleteComponent;
  let fixture: ComponentFixture<ChipsWithAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipsWithAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsWithAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
