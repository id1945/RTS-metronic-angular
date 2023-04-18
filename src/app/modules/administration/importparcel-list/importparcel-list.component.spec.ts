import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportParcelListComponent } from './importparcel-list.component';

describe('ImportParcelListComponent', () => {
  let component: ImportParcelListComponent;
  let fixture: ComponentFixture<ImportParcelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportParcelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportParcelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
