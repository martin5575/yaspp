import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownSelectorComponent } from './drop-down-selector.component';

describe('DropDownSelectorComponent', () => {
  let component: DropDownSelectorComponent;
  let fixture: ComponentFixture<DropDownSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropDownSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropDownSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
