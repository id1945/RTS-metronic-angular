import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessTripListComponent } from './businesstrip-list.component';


describe('BusinessTripListComponent', () => {
  let component: BusinessTripListComponent;
  let fixture: ComponentFixture<BusinessTripListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessTripListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
