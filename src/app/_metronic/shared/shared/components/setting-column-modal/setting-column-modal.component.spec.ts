import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingColumnModalComponent } from './setting-column-modal.component';

describe('SettingColumnModalComponent', () => {
  let component: SettingColumnModalComponent;
  let fixture: ComponentFixture<SettingColumnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingColumnModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingColumnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
