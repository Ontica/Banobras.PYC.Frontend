/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MediaType } from '@app/core';

import { FileReport, FileType } from '@app/models';


@Component({
  selector: 'emp-ng-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss']
})
export class FilePreviewComponent implements OnChanges {

  @Input() title: string;

  @Input() hint: string;

  @Input() file: FileReport;

  hasError = false;

  displayInModal = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.file && !!this.file?.url) {
      this.open(this.file.url, this.file.type);
    }
  }


  open(url: string, type: string) {
    if (!this.isValidUrl(url)) {
      return;
    }

    if (this.canOpenWindow(type)) {
      this.openWindow(url);
      this.onClose();
      return;
    }

    this.openModal();
  }


  onFileError() {
    this.hasError = true;
  }


  onClose() {
    this.displayInModal = false;
  }


  private isValidUrl(url: string): boolean {
    return url !== null && url !== undefined && url !== '';
  }


  private canOpenWindow(type: string): boolean {
    return type === MediaType.html || type === FileType.HTML;
  }


  private openWindow(url: string, width: number = 1100, height: number = 600) {
    const top = Math.floor((screen.height / 2) - (height / 2));
    const left = Math.floor((screen.width / 2) - (width / 2));

    return window.open(url, '_blank',
      `resizable=yes,width=${width},height=${height},top=${top},left=${left}`);
  }


  private openModal() {
    this.hasError = false;
    this.displayInModal = true;
  }

}
