import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportToFileComponent} from './export-to-file.component';

describe('ExportToFileComponent', () => {
  let component: ExportToFileComponent;
  let fixture: ComponentFixture<ExportToFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportToFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportToFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
