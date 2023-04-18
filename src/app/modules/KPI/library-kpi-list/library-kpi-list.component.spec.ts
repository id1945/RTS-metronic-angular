import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryKpiListComponent } from './library-kpi-list.component';

describe('LibraryKpiListComponent', () => {
  let component: LibraryKpiListComponent;
  let fixture: ComponentFixture<LibraryKpiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryKpiListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryKpiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
