import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDetailComponent } from './action-detail.component';

describe('ActionDetailComponent', () => {
  let component: ActionDetailComponent;
  let fixture: ComponentFixture<ActionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
