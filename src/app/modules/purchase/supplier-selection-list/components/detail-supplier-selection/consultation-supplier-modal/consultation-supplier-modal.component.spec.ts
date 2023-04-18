import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultationSupplierModalComponent } from './consultation-supplier-modal.component';


describe('ConsultationSupplierModalComponent', () => {
  let component: ConsultationSupplierModalComponent;
  let fixture: ComponentFixture<ConsultationSupplierModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationSupplierModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationSupplierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
