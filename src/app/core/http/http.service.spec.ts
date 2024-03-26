/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { HttpService } from './http.service';
import { DirectoryService } from './directory.service';


// describe('HttpService', () => {

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientModule],
//       providers: [HttpService, DirectoryService]
//     });
//   });

//   it('should return the license name', async(inject([HttpService], (httpService: HttpService) => {
//     const path = 'http://empiria/api/' + 'v1/system/license';

//     httpService.get<string>(path)
//                .subscribe((value) => expect(value).toBe('LicenceName') );

//   })));

// });
