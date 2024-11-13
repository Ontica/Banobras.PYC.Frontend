/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@NgModule()

export class IconSvgModule {

  private path = 'assets/img/files';

  constructor(private matIconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer){

    matIconRegistry.addSvgIcon('emp-pdf-file', this.setIconPath(`${this.path}/pdf.svg`));

    matIconRegistry.addSvgIcon('emp-xls-file', this.setIconPath(`${this.path}/xls.svg`));

    matIconRegistry.addSvgIcon('emp-xml-file', this.setIconPath(`${this.path}/xml.svg`));

    matIconRegistry.addSvgIcon('emp-image-file', this.setIconPath(`${this.path}/image.svg`));

    matIconRegistry.addSvgIcon('emp-file', this.setIconPath(`${this.path}/file.svg`));

  }

  private setIconPath(icon: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(icon);
  }

}
