import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractFullTableModalComponent } from './contract-full-table-modal.component';

describe('ContractFullTableModalComponent', () => {
  let component: ContractFullTableModalComponent;
  let fixture: ComponentFixture<ContractFullTableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractFullTableModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractFullTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
