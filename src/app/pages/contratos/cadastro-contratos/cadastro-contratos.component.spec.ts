import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroContratosComponent } from './cadastro-contratos.component';

describe('CadastroContratosComponent', () => {
  let component: CadastroContratosComponent;
  let fixture: ComponentFixture<CadastroContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroContratosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
