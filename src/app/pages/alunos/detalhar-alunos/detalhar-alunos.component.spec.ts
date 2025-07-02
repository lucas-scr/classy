import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalharAlunosComponent } from './detalhar-alunos.component';

describe('DetalharAlunosComponent', () => {
  let component: DetalharAlunosComponent;
  let fixture: ComponentFixture<DetalharAlunosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalharAlunosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalharAlunosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
