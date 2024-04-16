/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import { FileDownloadService } from '@app/data-services/file-services/file-download.service';

import { FormatLibrary } from '@app/shared/utils';

import { DefaultFileControlConfig, FileData, FileControlActions, FileControlConfig, FileControlMenuOptions,
         FileTypeAccepted, FileType, CsvFileTypeException, FileControlEventData } from './file-control-data';

@Component({
  selector: 'emp-ng-file-control',
  templateUrl: './file-control.component.html',
  styleUrls: ['./file-control.component.scss'],
})
export class FileControlComponent implements OnChanges {

  @Input() fileControl: FileData[] | FileData | null = null;

  @Output() fileControlChange = new EventEmitter<FileData[] | FileData | null>();

  @Output() fileControlEvent = new EventEmitter<FileControlEventData>();

  @Input() readonly = false;

  @Input() disabled = false;

  @Input() showError = false;

  @Input()
  get config() {
    return this.fileControlConfig;
  }
  set config(value: FileControlConfig) {
    this.fileControlConfig = Object.assign({}, DefaultFileControlConfig, value);
  }

  fileControlConfig = DefaultFileControlConfig;

  filesToUpload: FileData[] = [];

  acceptedFilesTypes: FileTypeAccepted[];

  acceptedFileString = '*';

  idFileControl: string = 'idFile' + Math.random().toString(16).slice(2);

  tagFileSelected = null;

  constructor(private fileDownload: FileDownloadService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.config) {
      this.setAcceptedFilesTypes();

      if (changes.config.previousValue?.tagDefault !== changes.config.currentValue?.tagDefault) {
        this.setTagFile();
      }
    }

    if (changes.fileControl) {
      this.setFilesSaved();
    }
  }

  handleFileInput(fileInput) {
    const fileList: FileList = fileInput.files;

    if (!fileList || fileList.length === 0 || this.readonly ||
        this.filesToUpload.length >= this.fileControlConfig.maxFiles) {
      return;
    }

    const oldFiles = this.filesToUpload ?? [];

    const filesArray = Array.from(fileList);

    const filesByAcceptedType: File[] = filesArray.filter(f => this.validateFileType(f));

    const newFiles: FileData[] = this.mapFileDataArrayFromFileArray(filesByAcceptedType);

    const allFiles = [...oldFiles, ...newFiles];

    this.filesToUpload = allFiles.length > this.fileControlConfig.maxFiles ?
      allFiles.slice(0, this.fileControlConfig.maxFiles) : allFiles;

    this.emitFiles();

    fileInput.value = '';
  }

  onClickFileOptions(file: FileData, option: FileControlActions) {
    if ('CANCEL' === option) {
      this.removeFile(file);
    }
    if ('SHOW' === option && !this.validateShowOption(file.type)) {
      return;
    }
    if ('DOWNLOAD' === option) {
      this.downloadFile(file.url);
    }
    this.fileControlEvent.emit({ option, file });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    event.stopPropagation();
  }

  onDropFile(event: DragEvent): void {
    event.preventDefault();
    this.handleFileInput(event.dataTransfer);
    event.stopPropagation();
  }

  onDownloadTemplateFile() {
    if (!this.tagFileSelected?.templateUrl) {
      return;
    }
    this.downloadFile(this.tagFileSelected.templateUrl);
  }

  formatBytes(sizeBytes) {
    return FormatLibrary.formatBytes(sizeBytes);
  }

  resetFileControl() {
    this.clearFileControl();
  }

  private setAcceptedFilesTypes() {
    this.acceptedFilesTypes = [];

    if (this.isFileTypeInConfig('all')) {
      this.validateAndSetAcceptedFileType('all', FileTypeAccepted.all);
    } else {
      this.validateAndSetAcceptedFileType('pdf', FileTypeAccepted.pdf);
      this.validateAndSetAcceptedFileType('excel', FileTypeAccepted.excel);
      this.validateAndSetAcceptedFileType('csv', FileTypeAccepted.csv);
      this.validateAndSetAcceptedFileType('image', FileTypeAccepted.image);
      this.validateAndSetAcceptedFileType('txt', FileTypeAccepted.txt);
    }

    this.acceptedFileString = this.acceptedFilesTypes.toString();
  }

  private isFileTypeInConfig(type: FileType): boolean {
    if (this.fileControlConfig.filesTypes.filter(x => x === type).length > 0) {
      return true;
    }
    return false;
  }

  private validateAndSetAcceptedFileType(type: FileType, accepted: FileTypeAccepted) {
    if (this.isFileTypeInConfig(type)) {
      this.acceptedFilesTypes = [...this.acceptedFilesTypes, ...[accepted]];
    }
  }

  private setFilesSaved() {
    if (this.fileControl) {
      this.filesToUpload = this.fileControl instanceof Array ? this.fileControl : [this.fileControl];
      this.filesToUpload.forEach(file => {
        file.menuOptions = this.getMenuOptions(file);
        file.sizeString = this.formatBytes(file.size);
        file.fileIcon = this.getFileIcon(file.type);
      });
      return;
    }
    this.filesToUpload = [];
  }

  private setTagFile() {
    if (this.fileControlConfig.tagRequired) {
      this.tagFileSelected =
        this.fileControlConfig.tagsList.find(x => x.type === this.fileControlConfig.tagDefault);
    } else {
      this.tagFileSelected = null;
    }
  }

  private getMenuOptions(file: FileData): FileControlMenuOptions[] {
    if (file.uid) {
      const options: FileControlMenuOptions[] = [];

      if (this.validateShowOption(file.type)) {
        options.push({ name: 'Ver', action: 'SHOW', icon: 'visibility' });
      }

      if (!!file.url) {
        options.push({ name: 'Descargar', action: 'DOWNLOAD', icon: 'file_download' });
      }

      if (!this.readonly) {
        options.push({ name: 'Eliminar', action: 'REMOVE', icon: 'delete' });
      }

      return options;
    }
    return [
      { name: 'Guardar', action: 'SAVE', icon: 'save' },
      { name: 'Cancelar', action: 'CANCEL', icon: 'clear' },
    ];
  }

  private validateShowOption(type: string): boolean {
    return type === FileTypeAccepted.pdf || type.startsWith('image/');
  }

  private getFileIcon(type: string) {
    if (type === FileTypeAccepted.pdf) {
      return 'emp-pdf-file';
    }

    if (FileTypeAccepted.excel.includes(type) || FileTypeAccepted.csv.includes(type) ||
        CsvFileTypeException === type) {
      return 'emp-xls-file';
    }

    if (type.startsWith('image/')) {
      return 'emp-image-file';
    }

    return 'emp-file';
  }

  private validateFileType(file: File) {
    if (this.isFileTypeInConfig('all')) {
      return true;
    }

    if (file.type === FileTypeAccepted.pdf) {
      return this.isValidFileType('pdf', file);
    }

    if (FileTypeAccepted.excel.includes(file.type)) {
      return this.isValidFileType('excel', file);
    }

    if (FileTypeAccepted.csv.includes(file.type) || CsvFileTypeException === file.type) {
      return this.isValidFileType('csv', file);
    }

    if (file.type.startsWith('image/')) {
      return this.isValidFileType('image', file);
    }

    if (file.type === FileTypeAccepted.txt) {
      return this.isValidFileType('txt', file);
    }

    return false;
  }

  private isValidFileType(type: FileType, file: File) {
    if (this.isFileTypeInConfig(type)) {
      return true;
    }

    console.log(`Invalid format: ${file.type}. File: ${file.name}. Is required: ${this.acceptedFileString}.`);
    return false;
  }

  private mapFileDataArrayFromFileArray(fileList: File[]): FileData[] {
    const files: FileData[] = [];
    fileList.forEach(item => files.push(this.mapFileDataFromFile(item)));
    return files;
  }

  private mapFileDataFromFile(file: File): FileData {
    return {
      file,
      name: this.getFileName(file.name),
      type: file.type,
      size: file.size,
      sizeString: FormatLibrary.formatBytes(file.size),
      tag: this.tagFileSelected?.type ?? '',
      fileIcon: this.getFileIcon(file.type),
      menuOptions: this.getMenuOptions(file)
    };
  }

  private getFileName(name: string) {
    return this.fileControlConfig.fileName ?
      this.fileControlConfig.fileName + this.getFileNameExtension(name) :
      name;
  }

  private getFileNameExtension(name: string) {
    const strings = name.split('.');
    return strings.length > 1 ? '.' + strings[strings.length - 1] : '';
  }

  private emitFiles() {
    let files: FileData | FileData[] = this.filesToUpload;

    if (this.fileControlConfig.maxFiles === 1) {
      files = this.filesToUpload.length >= 1 ? this.filesToUpload[0] : null;
    }

    this.fileControlChange.emit(files);
  }

  private downloadFile(url: string) {
    this.fileDownload.download(url);
  }

  private removeFile(file) {
    this.filesToUpload = this.filesToUpload.filter(f => f !== file);
    this.emitFiles();
  }

  private clearFileControl() {
    this.filesToUpload = [];
    this.emitFiles();
  }

}
