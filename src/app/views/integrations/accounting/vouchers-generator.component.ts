/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { MessageBoxService } from '@app/shared/services';

import { SkipIf } from '@app/shared/decorators';

import { IntegrationsDataService } from '@app/data-services';


@Component({
  selector: 'emp-pyc-vouchers-generator',
  templateUrl: './vouchers-generator.component.html',
})
export class VouchersGeneratorComponent {

  @Output() closeEvent = new EventEmitter<void>();

  submitted = false;

  title = 'Generar pólizas contables';


  constructor(private integrationsData: IntegrationsDataService,
              private messageBox: MessageBoxService) { }


  @SkipIf('submitted')
  onCloseButtonClicked() {
    this.closeEvent.emit();
  }


  @SkipIf('submitted')
  onSubmitButtonClicked() {
    this.generateVouchers();
  }


  private generateVouchers() {
    this.submitted = true;

    this.integrationsData.generateVouchers()
      .firstValue()
      .then(x => this.resolveGenerateVouchers(x.message))
      .finally(() => this.submitted = false);
  }


  private resolveGenerateVouchers(message: string) {
    this.messageBox.show(message, this.title);
    setTimeout(() => this.onCloseButtonClicked());
  }

}
