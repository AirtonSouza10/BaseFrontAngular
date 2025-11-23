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
import { UsuarioComponent } from './components/usuario/usuario.component';
import { RelatorioDiaComponent } from './components/relatorio-dia/relatorio-dia.component';
import { RelatorioFilialComponent } from './components/relatorio-filial/relatorio-filial.component';
import { TipoDuplicataComponent } from './components/tipo-duplicata/tipo-duplicata.component';
import { ProtocoloNotaComponent } from './components/protocolo-nota/protocolo-nota.component';
import { ProtocoloContaPagaComponent } from './components/protocolo-conta-paga/protocolo-conta-paga.component';
import { RelatorioPersonalizadoComponent } from './components/relatorio-personalizado/relatorio-personalizado.component';
import { ConsultaGeralComponent } from './components/consulta-geral/consulta-geral.component';
import { ConsultaGeralAtivasComponent } from './components/consulta-geral-ativas/consulta-geral-ativas.component';
import { ConsultaNotaComponent } from './components/consulta-nota/consulta-nota.component';
import { ParcelasPrevistasComponent } from './components/parcelas-previstas/parcelas-previstas.component';

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
      },
      {
        path: 'usuarios',
        component: UsuarioComponent
      },
      {
        path: 'tipo-duplicata',
        component: TipoDuplicataComponent
      },
      {
        path: 'relatorio-dia',
        component: RelatorioDiaComponent
      },
      {
        path: 'relatorio-filial',
        component: RelatorioFilialComponent
      },
      {
        path: 'protocolo-nota',
        component: ProtocoloNotaComponent
      },
      {
        path: 'protocolo-conta-paga',
        component: ProtocoloContaPagaComponent
      },
      {
        path: 'relatorio-personalizado',
        component: RelatorioPersonalizadoComponent
      },
      {
        path: 'consulta-geral',
        component: ConsultaGeralComponent
      },
      {
        path: 'consulta-geral-ativas',
        component: ConsultaGeralAtivasComponent
      },
      {
        path: 'consulta-nota',
        component: ConsultaNotaComponent
      },
      {
        path: 'parcelas-previstas',
        component: ParcelasPrevistasComponent
      }
    ]
  }
];
