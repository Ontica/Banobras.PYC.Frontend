/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


const fs = require('fs');
const path = require('path');

function getFormattedVersion() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  return `${yyyy}${MM}${dd}-${HH}${mm}${ss}`;
}

const data = {
  version:  getFormattedVersion()
};

const outputPath = path.join(__dirname, '../src/version.json');

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');


console.log(`✅ version.json generado en: ${outputPath}`);
console.log(`📌 versión: ${data.version}`);
