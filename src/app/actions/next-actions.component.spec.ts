import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextActionsComponent } from './next-actions.component';

describe('NextActionsComponent', () => {
  let component: NextActionsComponent;
  let fixture: ComponentFixture<NextActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NextActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
