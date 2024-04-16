/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';


@Injectable()
export class PrinterService {

  printFile(url) {
    if (url !== null && url !== undefined && url !== '') {
      const proxyIframe = this.createProxyIframe();
      this.createContent(proxyIframe.contentWindow, url);
      this.removeProxyIframe(proxyIframe);
    }
  }

  private createProxyIframe() {
    const proxyIframe = document.createElement('iframe');
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(proxyIframe);

    proxyIframe.id = 'iframe_printer';
    proxyIframe.style.width = '100%';
    proxyIframe.style.height = '100%';
    proxyIframe.style.display = 'none';

    return proxyIframe;
  }

  private createContent(contentIframe, url) {
    contentIframe.document.open();

    contentIframe.document.write(`
      <iframe src="${url}" onload="print();"
        style="height: 100%; width: 1000px; position: absolute;"
        frameborder="0" marginheight="0" marginwidth="0">
      </iframe>
    `);

    contentIframe.document.close();
  }

  private removeProxyIframe(proxyIframe) {
    setTimeout(() => {
      proxyIframe.remove();
    }, 1000);
  }

}
