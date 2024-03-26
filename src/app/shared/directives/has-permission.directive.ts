/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { SessionService } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';


@Directive({
  selector: '[empNgHasPermission]'
})
export class EmpHasPermissionDirective implements OnInit {

  @Input() set empNgHasPermission(permission) {
    this.permission = permission;
    this.updateView();
  }

  private permission: PERMISSIONS | PERMISSIONS[] = null;

  private isHidden = true;

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private session: SessionService) {}


  ngOnInit() {
    this.updateView();
  }


  private updateView() {
    if (this.session.hasPermission(this.permission)) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }

}
