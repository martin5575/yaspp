import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchBetsComponent } from './match-bets.component';

describe('MatchBetsComponent', () => {
  let component: MatchBetsComponent;
  let fixture: ComponentFixture<MatchBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchBetsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
