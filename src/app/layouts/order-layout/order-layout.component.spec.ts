import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLayoutComponent } from './order-layout.component';

describe('OrderLayoutComponent', () => {
  let component: OrderLayoutComponent;
  let fixture: ComponentFixture<OrderLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
