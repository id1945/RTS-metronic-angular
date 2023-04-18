import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveRegimeModalComponent } from './approve-regime-modal.component';


describe('ApproveRegimeModalComponent', () => {
  let component: ApproveRegimeModalComponent;
  let fixture: ComponentFixture<ApproveRegimeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRegimeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRegimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
