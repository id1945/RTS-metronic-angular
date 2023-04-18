import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmissionsCreateModalComponent } from './submissions-create-modal.component';

describe('SubmissionsCreateModalComponent', () => {
  let component: SubmissionsCreateModalComponent;
  let fixture: ComponentFixture<SubmissionsCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionsCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionsCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
