import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultationContractModalComponent } from './consultation-contract-modal.component';


describe('ConsultationContractModalComponent', () => {
  let component: ConsultationContractModalComponent;
  let fixture: ComponentFixture<ConsultationContractModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationContractModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationContractModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
