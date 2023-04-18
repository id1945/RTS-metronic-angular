import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailParcelModalComponent } from './detail-parcel-modal.component';

describe('DetailParcelModalComponent', () => {
  let component: DetailParcelModalComponent;
  let fixture: ComponentFixture<DetailParcelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailParcelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailParcelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
