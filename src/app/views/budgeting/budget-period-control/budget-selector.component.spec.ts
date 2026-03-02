import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSelectorComponent } from './budget-selector.component';

describe('BudgetSelectorComponent', () => {
  let component: BudgetSelectorComponent;
  let fixture: ComponentFixture<BudgetSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
