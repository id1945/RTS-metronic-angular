import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveRegimeProposeModalComponent } from './approve-regime-propose-modal.component';


describe('ApproveRegimeProposeModalComponent', () => {
  let component: ApproveRegimeProposeModalComponent;
  let fixture: ComponentFixture<ApproveRegimeProposeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRegimeProposeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRegimeProposeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
