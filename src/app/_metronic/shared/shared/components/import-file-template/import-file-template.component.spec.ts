import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFileTemplateComponent } from './import-file-template.component';

describe('ImportFileTemplateComponent', () => {
  let component: ImportFileTemplateComponent;
  let fixture: ComponentFixture<ImportFileTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportFileTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFileTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
