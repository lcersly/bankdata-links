import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogDeleteLinkComponent} from './dialog-delete-link.component';

describe('DialogDeleteComponent', () => {
  let component: DialogDeleteLinkComponent;
  let fixture: ComponentFixture<DialogDeleteLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogDeleteLinkComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
