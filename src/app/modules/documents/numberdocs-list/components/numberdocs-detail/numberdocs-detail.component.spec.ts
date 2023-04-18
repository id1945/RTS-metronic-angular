import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberdocsDetailComponent } from './numberdocs-detail.component';

describe('NumberdocsDetailComponent', () => {
  let component: NumberdocsDetailComponent;
  let fixture: ComponentFixture<NumberdocsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberdocsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberdocsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
