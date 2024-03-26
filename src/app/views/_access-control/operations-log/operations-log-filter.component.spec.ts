import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsLogFilterComponent } from './operations-log-filter.component';

describe('OperationsLogFilterComponent', () => {
  let component: OperationsLogFilterComponent;
  let fixture: ComponentFixture<OperationsLogFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationsLogFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationsLogFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
