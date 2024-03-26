/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ContentChild, TemplateRef, ViewChild, EventEmitter, forwardRef, Input, Output, OnInit,
         OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { Subject } from 'rxjs';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DropdownPosition, NgSelectComponent } from '@ng-select/ng-select';


export interface SelectBoxConfig {
  addTag?: boolean;
  addTagText?: string;
  appendTo?: string;
  autoSelect?: boolean;
  bindByValue?: boolean;
  clearable?: boolean;
  clearAllText?: string;
  closeOnSelect?: boolean;
  dropdownPosition?: DropdownPosition;
  groupBy?: string;
  hideSelected?: boolean;
  loadingText?: string;
  minTermLength?: number;
  multiple?: boolean;
  notFoundText?: string;
  searchable?: boolean;
  selectFirst?: boolean;
  typeToSearchText?: string;
  virtualScroll?: boolean;
  searchableFields?: string[];
}


const DefaultSelectBoxConfig: SelectBoxConfig = {
  addTag: false,
  addTagText: 'Agregar Item',
  appendTo: 'body',
  autoSelect: false,
  bindByValue: true,
  clearable: false,
  clearAllText: 'Limpiar todo',
  closeOnSelect: true,
  dropdownPosition: 'auto',
  groupBy: null,
  hideSelected: false,
  loadingText: 'Cargando',
  minTermLength: 5,
  multiple: false,
  notFoundText: 'No se encontraron registros',
  searchable: true,
  selectFirst: false,
  typeToSearchText: 'Favor de ingresar 5 o más caracteres',
  virtualScroll: false,
  searchableFields: ['name']
};


@Component({
  selector: 'emp-ng-select',
  templateUrl: './select-box.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBoxComponent),
      multi: true
    }
  ]
})
export class SelectBoxComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @ViewChild(NgSelectComponent) select: NgSelectComponent;

  @ContentChild('labelTemplate', { read: TemplateRef }) labelTemplate: TemplateRef<any>;
  @ContentChild('groupTemplate', { read: TemplateRef }) groupTemplate: TemplateRef<any>;
  @ContentChild('optionTemplate', { read: TemplateRef }) optionTemplate: TemplateRef<any>;
  @ContentChild('headerTemplate', { read: TemplateRef }) headerTemplate: TemplateRef<any>;
  @ContentChild('footerTemplate', { read: TemplateRef }) footerTemplate: TemplateRef<any>;

  @Input() items: any[];
  @Input() bindLabel = 'name';
  @Input() bindValue = 'uid';
  @Input() placeholder = 'Seleccionar';

  @Input() loading = false;
  @Input() typeahead: Subject<string>;
  @Input() showError = false;

  @Input()
  get config() {
    return this.selectBoxConfig;
  }
  set config(value: SelectBoxConfig) {
    this.selectBoxConfig = Object.assign({}, DefaultSelectBoxConfig, value);
  }

  @Output() clear = new EventEmitter<boolean>();
  @Output() changes = new EventEmitter<any>();
  @Output() search = new EventEmitter<any>();
  @Output() unfocus = new EventEmitter<any>();

  selectBoxConfig = DefaultSelectBoxConfig;

  onChange: (value: any) => void;
  onTouched: (event: any) => void;

  disabled: boolean;
  value: any = null;
  useCustomSearchFn = false;

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll, true);
    window.addEventListener('resize', this.onResize, true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      if (this.selectBoxConfig.autoSelect) {
        this.selectItemIfUnique();
      }
      if (this.selectBoxConfig.selectFirst) {
        this.selectFirstItem();
      }
      this.setSearchField();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll, true);
    window.removeEventListener('resize', this.onResize, true);
  }

  writeValue(value: any): void {
    this.value = value ? value : null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChangedEvent(event) {
    let value = event;

    if (Array.isArray(event)) {
      value = event.map(item => this.selectBoxConfig.bindByValue && this.bindValue ?
                                item[this.bindValue] :
                                item);
    } else if (event) {
      value = this.selectBoxConfig.bindByValue && this.bindValue ? event[this.bindValue] : event;
    }

    this.onChange(value);
    this.changes.emit(event);
  }

  onClear() {
    this.clear.emit(true);
  }

  clearModel() {
    this.select.clearModel();
  }

  onSearch(event) {
    this.search.emit(event);
  }

  onBlur(event) {
    this.unfocus.emit(event);
  }

  customSearchFn(term: string, item: any) {
    return item?.search_field?.toLowerCase().includes(term.toLowerCase());
  }

  private selectItemIfUnique() {
    if (this.items.length !== 1 || this.value !== null) {
      return;
    }

    this.selectFirstItem();
  }

  private selectFirstItem() {
    setTimeout(() => {
      if (this.items.length > 0) {
        this.onChangedEvent(this.items[0]);
        this.writeValue(this.selectBoxConfig.bindByValue && this.bindValue ?
                        this.items[0][this.bindValue] : this.items[0]);
      }
    }, 100);
  }

  private onResize = (event: any) => {
    if (this.select && this.select.isOpen) {
      this.select.close();
    }
  };

  private onScroll = (event: any) => {
    const autoscroll = event.srcElement.classList.contains('ng-dropdown-panel-items');

    const inputOverflow = event.srcElement.offsetParent.classList.contains('ng-input');

    if (this.select && this.select.isOpen && !autoscroll && !inputOverflow) {
      this.select.close();
    }
  };

  private setSearchField() {
    this.useCustomSearchFn = this.selectBoxConfig.searchableFields.length > 1 && this.items?.length > 0;
    if (this.useCustomSearchFn) {
      this.items = this.items.map(item => {
        item.search_field = '';
        this.selectBoxConfig.searchableFields.forEach(field => item.search_field += item[field] + ' ');
        item.search_field = item.search_field.trimEnd();
        return item;
      });
    }
  }

}
