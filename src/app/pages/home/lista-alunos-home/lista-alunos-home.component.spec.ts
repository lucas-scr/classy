import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAlunosHomeComponent } from './lista-alunos-home.component';

describe('ListaAlunosHomeComponent', () => {
  let component: ListaAlunosHomeComponent;
  let fixture: ComponentFixture<ListaAlunosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAlunosHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAlunosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
