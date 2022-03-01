import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';
import {
  NbActionsModule, NbAlertModule, NbButtonGroupModule, NbButtonModule,
  NbCardModule, NbCheckboxModule, NbContextMenuModule, NbDialogModule,
  NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbFormFieldModule,
  NbMenuModule, NbPopoverModule, NbSidebarModule, NbThemeModule, NbToggleModule, NbUserModule,
} from '@nebular/theme';
import {
  NgbDateAdapter, NgbDateParserFormatter,
  NgbDatepickerModule, NgbNavModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { NgxSpinnerModule } from 'ngx-spinner';
import {
  FooterComponent, HeaderComponent, LayoutComponent,
} from './components';

import { NgxSortableHeaderDirective } from './directives';
import { CustomDateAdapter, NgbDateCustomParserFormatter } from './utils';
import { ClipboardModule } from '@angular/cdk/clipboard';


const ANGULAR_MODULES = [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, ClipboardModule ];

const NB_MODULES = [
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbDialogModule,
  NbEvaIconsModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbSecurityModule,
  NbSidebarModule,
  NbUserModule,
  NbToggleModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbButtonGroupModule,
  NbFormFieldModule,
];

const OTHERS_MODULES = [
  //NgSelectModule,
  NgbPaginationModule,
  NgbDatepickerModule,
  //NgxSpinnerModule,
  NgbNavModule,
];

const COMPONENTS = [
  FooterComponent,
  HeaderComponent,
  LayoutComponent,
];

const DIRECTIVE = [
  NgxSortableHeaderDirective,
];


@NgModule({
  imports: [...ANGULAR_MODULES, ...NB_MODULES, ...OTHERS_MODULES],
  exports: [...ANGULAR_MODULES, ...NB_MODULES, ...OTHERS_MODULES, ...COMPONENTS, ...DIRECTIVE],
  declarations: [...COMPONENTS, ...DIRECTIVE],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: NgbDateAdapter, useClass: CustomDateAdapter },
  ],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'material-light',
          },
        ).providers,
      ],
    };
  }
}
