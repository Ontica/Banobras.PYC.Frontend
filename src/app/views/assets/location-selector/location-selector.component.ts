/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Empty, Identifiable, isEmpty } from '@app/core';

import { AssetsDataService } from '@app/data-services';

import { buildLocationSelection, EmptyLocationSelection, LocationSelection } from '@app/models';


@Component({
  selector: 'emp-pyc-location-selector',
  templateUrl: './location-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationSelectorComponent),
      multi: true
    },
  ]
})
export class LocationSelectorComponent implements ControlValueAccessor, OnInit {

  @Input() showError = false;

  @Input() errors = null;

  @Input() required = false;

  @Output() changes = new EventEmitter<any>();

  value: LocationSelection;

  onChange: (value: LocationSelection) => void;

  onTouched: () => void;

  disabled: boolean;

  buildingsList: Identifiable[] = [];

  floorsList: Identifiable[] = [];

  placesList: Identifiable[] = [];

  selectedBuilding = null;

  selectedFloor = null;

  selectedPlace = null;

  isLoadingBuildings = false;

  isLoadingFloors = false;

  isLoadingPlaces = false;


  constructor(private assetsData: AssetsDataService) {}


  ngOnInit() {
    this.getBuildings();
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }


  writeValue(value: LocationSelection) {
    const location = !value ? EmptyLocationSelection : value;
    this.setLocationData(location);
    this.value = location;
  }


  get buildingPlaceholder(): string {
    if (this.disabled) {
      return 'No determinado';
    }

    if (!this.required) {
      return 'Todos';
    }

    return 'Seleccionar';
  }


  get floorPlaceholder(): string {
    if (this.disabled) {
      return 'No determinado';
    }

    if (!this.required) {
      return 'Todos';
    }

    if (isEmpty(this.value.building)) {
      return 'Seleccione edificio';
    }

    return 'Seleccionar';
  }


  get placePlaceholder(): string {
    if (this.disabled) {
      return 'No determinado';
    }

    if (!this.required) {
      return 'Todos';
    }

    if (isEmpty(this.value.floor)) {
      return 'Seleccione piso';
    }

    return 'Seleccionar';
  }


  onBuildingChanges(building: Identifiable) {
    this.value.floor = null;
    this.selectedFloor = null;

    if (isEmpty(building)) {
      this.floorsList = [];
    } else {
      this.getFloors(building.uid);
    }

    this.onFloorChanges(Empty);
  }


  onFloorChanges(floor: Identifiable) {
    this.value.place = null;

    this.selectedPlace = null;

    if (isEmpty(floor)) {
      this.placesList = [];
    } else {
      this.getPlaces(floor.uid);
    }

    this.onLocationDataChanged();
  }


  onLocationDataChanged() {
    const value = buildLocationSelection(this.selectedBuilding, this.selectedFloor, this.selectedPlace);
    this.onChange(value);
    this.changes.emit(value);
  }


  private getBuildings() {
    this.isLoadingBuildings = true;

    this.assetsData.getAssetRootLocations()
      .firstValue()
      .then(x => this.buildingsList = x)
      .finally(() => this.isLoadingBuildings = false);
  }


  private getFloors(buildingUID: string) {
    this.isLoadingFloors = true;

    this.assetsData.getAssetLocationsList(buildingUID)
      .firstValue()
      .then(x => this.floorsList = x)
      .finally(() => this.isLoadingFloors = false);
  }


  private getPlaces(floorUID: string) {
    this.isLoadingPlaces = true;

    this.assetsData.getAssetLocationsList(floorUID)
      .firstValue()
      .then(x => this.placesList = x)
      .finally(() => this.isLoadingPlaces = false);
  }


  private setLocationData(location: LocationSelection) {
    this.selectedBuilding = location?.building ?? null;
    this.selectedFloor = location?.floor ?? null;
    this.selectedPlace = location?.place ?? null;

    if (!isEmpty(this.selectedBuilding)) {
      this.getFloors(this.selectedBuilding.uid);
    }

    if (!isEmpty(this.selectedFloor)) {
      this.getPlaces(this.selectedFloor.uid);
    }
  }

}
