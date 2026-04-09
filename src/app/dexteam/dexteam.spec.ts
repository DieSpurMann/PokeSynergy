import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dexteam } from './dexteam';

describe('Dexteam', () => {
  let component: Dexteam;
  let fixture: ComponentFixture<Dexteam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dexteam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dexteam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
