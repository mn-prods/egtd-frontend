import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTypeButtonComponent } from './action-type-button.component';

describe('ActionTypeButtonComponent', () => {
  let component: ActionTypeButtonComponent;
  let fixture: ComponentFixture<ActionTypeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionTypeButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionTypeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
