import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxActionChoiceComponent } from './inbox-action-choice.component';

describe('InboxActionChoiceComponent', () => {
  let component: InboxActionChoiceComponent;
  let fixture: ComponentFixture<InboxActionChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboxActionChoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InboxActionChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
