import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductypeListComponent } from './productype-list.component';

describe('ProductypeListComponent', () => {
  let component: ProductypeListComponent;
  let fixture: ComponentFixture<ProductypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
