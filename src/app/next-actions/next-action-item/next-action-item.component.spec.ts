import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextActionItemComponent } from './next-action-item.component';

describe('NextActionItemComponent', () => {
  let component: NextActionItemComponent;
  let fixture: ComponentFixture<NextActionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextActionItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NextActionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
