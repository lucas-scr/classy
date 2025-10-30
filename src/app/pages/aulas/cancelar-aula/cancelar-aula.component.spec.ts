import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarAulaComponent } from './cancelar-aula.component';

describe('CancelarAulaComponent', () => {
  let component: CancelarAulaComponent;
  let fixture: ComponentFixture<CancelarAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelarAulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelarAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
