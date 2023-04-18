import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberdocsListComponent } from './numberdocs-list.component';

describe('NumberdocsListComponent', () => {
  let component: NumberdocsListComponent;
  let fixture: ComponentFixture<NumberdocsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberdocsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberdocsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
