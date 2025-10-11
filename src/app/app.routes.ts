import { Routes } from '@angular/router';
import { AppMainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { TipoNotaComponent } from './components/tipo-nota/tipo-nota.component';
import { TipoPagamentoComponent } from './components/tipo-pagamento/tipo-pagamento.component';
import { FormaPagamentoComponent } from './components/forma-pagamento/forma-pagamento.component';
import { SituacaoComponent } from './components/situacao/situacao.component';
import { FilialComponent } from './components/filial/filial.component';
import { FornecedorComponent } from './components/fornecedor/fornecedor.component';
import { NotaFiscalComponent } from './components/nota-fiscal/nota-fiscal.component';
import { DuplicataComponent } from './components/duplicata/duplicata.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'main',
    component: AppMainComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'tipo-nota',
        component: TipoNotaComponent
      },
      {
        path: 'tipo-pagamento',
        component: TipoPagamentoComponent
      },
      {
        path: 'forma-pagamento',
        component: FormaPagamentoComponent
      },
      {
        path: 'situacao',
        component: SituacaoComponent
      },
      {
        path: 'filial',
        component: FilialComponent
      },
      {
        path: 'fornecedor',
        component: FornecedorComponent
      },
      {
        path: 'nota-fiscal',
        component: NotaFiscalComponent
      },
      {
        path: 'duplicata',
        component: DuplicataComponent
      }
    ]
  }
];
