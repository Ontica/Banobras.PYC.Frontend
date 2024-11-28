/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { MediaType } from '@app/core';

import { FileDownloadService } from '@app/shared/services';

import { FileType } from '@app/models';


@Component({
  selector: 'emp-ng-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss']
})
export class FilePreviewComponent {

  @Input() title: string;

  @Input() hint: string;

  fileUrl: string;

  fileType: string;

  hasError = false;

  displayModal = false;


  constructor(private fileDownload: FileDownloadService) { }


  get isUrlValid(): boolean {
    return this.fileUrl !== null && this.fileUrl !== undefined && this.fileUrl !== '';
  }


  get isHTML(): boolean {
    return this.fileType === MediaType.html ||
           this.fileType === FileType.HTML ||
           this.fileType.toLowerCase() === 'html';
  }


  get isPDF(): boolean {
    return this.fileType === MediaType.pdf ||
           this.fileType === FileType.PDF ||
           this.fileType.toLowerCase() === 'pdf';
  }


  open(url: string, type: string) {
    this.setFileData(url, type);

    if (!this.isUrlValid) {
      console.log('Invalid URL: ', this.fileUrl);
      return;
    }

    if (this.isHTML) {
      this.openWindow(this.fileUrl);
      return;
    }

    if (this.isPDF) {
      this.openModal();
      return;
    }

    this.downloadFile();
  }


  onFileError() {
    this.hasError = true;
  }


  onCloseClicked() {
    this.displayModal = false;
  }


  private setFileData(url: string, type: string) {
    this.fileUrl = url;
    this.fileType = type;
  }


  private openWindow(url: string, width: number = 1100, height: number = 600) {
    this.onCloseClicked();

    const top = Math.floor((screen.height / 2) - (height / 2));
    const left = Math.floor((screen.width / 2) - (width / 2));

    return window.open(url, '_blank',
      `resizable=yes,width=${width},height=${height},top=${top},left=${left}`);
  }


  private openModal() {
    this.hasError = false;
    this.displayModal = true;
  }


  private downloadFile() {
    this.fileDownload.download(this.fileUrl);
  }

}
