import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarAtividadesAlunoComponent } from './cadastrar-atividades-aluno.component';

describe('CadastrarAtividadesAlunoComponent', () => {
  let component: CadastrarAtividadesAlunoComponent;
  let fixture: ComponentFixture<CadastrarAtividadesAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarAtividadesAlunoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarAtividadesAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
