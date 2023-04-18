import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegimeProposeListComponent } from './regime-propose-list.component';

describe('RegimeProposeListComponent', () => {
  let component: RegimeProposeListComponent;
  let fixture: ComponentFixture<RegimeProposeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegimeProposeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimeProposeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
