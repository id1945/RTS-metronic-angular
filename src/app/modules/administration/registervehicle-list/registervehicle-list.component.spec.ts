import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterVehicleListComponent } from './registervehicle-list.component';


describe('RegisterVehicleListComponent', () => {
  let component: RegisterVehicleListComponent;
  let fixture: ComponentFixture<RegisterVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterVehicleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
