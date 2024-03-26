/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { DirectoryService } from './directory.service';
import { HttpMethod } from './common-types';
import { HttpHandler } from './http-handler';

import { SessionService } from '../general/session.service';
import { ApplicationSettingsService } from '../general/application-settings.service';


describe('DirectoryService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DirectoryService, HttpHandler, SessionService, ApplicationSettingsService]
    });
  });

  it(`should return undefined when it's called using a full url`, waitForAsync(
    inject([DirectoryService], (directory: DirectoryService) => {
      directory.getService('https://no-domain.io/tests/collection')
               .subscribe((value) => {
                  expect(value).toBeUndefined();
               });
    })));

  it(`should return a GET service using the service's UID`, waitForAsync(
    inject([DirectoryService], (directory: DirectoryService) => {
      directory.getService('System.GetLicense')
               .subscribe((value) => {
                  expect(value).toBeDefined();
                  expect(value.path).toBe('v1/system/license');
               });

    })));

  it(`should return a POST service using the service's UID`, waitForAsync(
    inject([DirectoryService], (directory: DirectoryService) => {
      directory.getService('Security.Login')
               .subscribe((value) => {
                  expect(value).toBeDefined();
                  expect(value.path).toBe('v1/security/login');
                  expect(value.method).toBe(HttpMethod.POST);
               });
    })));

  it(`should return a GET service using the service's path`, waitForAsync(
    inject([DirectoryService], (directory: DirectoryService) => {
      directory.getService('v1/system/license')
               .subscribe((value) => {
                  expect(value).toBeDefined();
                  expect(value.path).toBe('v1/system/license');
                  expect(value.uid).toBe('System.GetLicense');
               });
    })));

  it(`should return a POST service using the service's path`, waitForAsync(
    inject([DirectoryService], (directory: DirectoryService) => {
      directory.getService('v1/security/login')
               .subscribe((value) => {
                  expect(value).toBeDefined();
                  expect(value.path).toBe('v1/security/login');
                  expect(value.uid).toBe('Security.Login');
                  expect(value.method).toBe(HttpMethod.POST);
               });

    })));

  it(`should return an ambiguous GET service using the service's path and HttpMethod`, waitForAsync(
    inject([DirectoryService], (directory: DirectoryService) => {
      directory.getService('v1/tests/collection', HttpMethod.GET)
               .subscribe((value) => {
                  expect(value).toBeDefined();
                  expect(value.path).toBe('v1/tests/collection');
                  expect(value.uid).toBe('Tests.GetCollection');
                  expect(value.method).toBe(HttpMethod.GET);
               });

    })));

  it(`should return an ambiguous POST service using the service's path and HttpMethod`, waitForAsync(
    inject([DirectoryService], (directory: DirectoryService) => {
      directory.getService('v1/tests/collection', HttpMethod.POST)
               .subscribe((value) => {
                  expect(value).toBeDefined();
                  expect(value.path).toBe('v1/tests/collection');
                  expect(value.uid).toBe('Tests.PostCollection');
                  expect(value.method).toBe(HttpMethod.POST);
               });

    })));

  it(`should return a GET service with parameters using the service's uid`, waitForAsync(
    inject([DirectoryService], (directory: DirectoryService) => {
      directory.getService('Tests.GetCollectionItem')
               .subscribe((value) => {
                  expect(value).toBeDefined();
                  expect(value.path).toBe('v1/tests/collection/{0}');
                  expect(value.uid).toBe('Tests.GetCollectionItem');
                  expect(value.method).toBe(HttpMethod.GET);
               });

    })));

});
