import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TagUsageButtonComponent} from './tag-usage-button.component';

describe('TagUsageButtonComponent', () => {
  let component: TagUsageButtonComponent;
  let fixture: ComponentFixture<TagUsageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagUsageButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagUsageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
