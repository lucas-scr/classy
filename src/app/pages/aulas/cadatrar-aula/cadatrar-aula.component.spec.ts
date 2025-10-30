import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadatrarAulaComponent } from './cadatrar-aula.component';

describe('CadatrarAulaComponent', () => {
  let component: CadatrarAulaComponent;
  let fixture: ComponentFixture<CadatrarAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadatrarAulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadatrarAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
