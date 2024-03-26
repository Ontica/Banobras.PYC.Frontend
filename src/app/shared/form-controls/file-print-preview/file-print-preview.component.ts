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
  selector: 'emp-ng-file-print-preview',
  templateUrl: './file-print-preview.component.html',
  styleUrls: ['./file-print-preview.component.scss']
})
export class FilePrintPreviewComponent implements OnChanges {

  @Input() title: string;

  @Input() hint: string;

  @Input() file: FileReport;

  display = false;

  url: string = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.file && !!this.file?.url) {
      this.open(this.file.url, this.file.type);
    }
  }


  open(url, type) {
    if (!this.validUrl(url)) {
      return;
    }

    if (type === MediaType.html || type === FileType.HTML) {
      this.openWindowCenter(url);
      return;
    }

    this.url = url;
    this.display = true;
  }


  onClose() {
    this.url = null;
    this.display = false;
  }


  private validUrl(url: string) {
    return url !== null && url !== undefined && url !== '';
  }


  private openWindowCenter(url: string, width: number = 1100, height: number = 600) {
    const top = Math.floor((screen.height / 2) - (height / 2));
    const left = Math.floor((screen.width / 2) - (width / 2));

    return window.open(url, '_blank',
      `resizable=yes,width=${width},height=${height},top=${top},left=${left}`);
  }

}
