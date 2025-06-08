# BANOBRAS - Aplicación Frontend Web del Sistema PYC

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6ccf199ebada40bbb9c59e1eedc58573)](https://app.codacy.com/gh/Ontica/Banobras.PYC.Frontend/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
&nbsp; &nbsp;
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Ontica_Banobras.PYC.Frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Ontica_Banobras.PYC.Frontend)

La nueva versión del **Sistema PYC (Presupuesto y Control)** está siendo desarrollada por
nuestra organización, a la medida de las necesidades del Banco Nacional de Obras y Servicios
Públicos S.N.C (BANOBRAS).

[BANOBRAS](https://www.gob.mx/banobras) es una institución de banca de desarrollo mexicana cuya labor
es financiar obras para la creación de servicios públicos. Por el tamaño de su cartera de crédito directo,
es el cuarto Banco más grande del sistema bancario mexicano y el primero de la Banca de Desarrollo.

El Sistema PYC está conformado por tres sistemas integrados que conviven entre sí:

1.  Sistema de control presupuestal (basado en [Empiria Budgeting](https://github.com/Ontica/Empiria.Budgeting)).
2.  Sistema de administración del flujo de efectivo (basado en [Empiria Cashflow](https://github.com/Ontica/Empiria.Cashflow))
3.  Sistema de pago a proveedores (basado en [Empiria Payments](https://github.com/Ontica/Empiria.Payments)).

Los tres sistemas operan sobre el presupuesto del gasto corriente y sobre el presupuesto del programa financiero del Banco.

Este frontend es una aplicación [Angular](https://angular.io) de página única (*Single Page Application*), por lo que toda la información que se despliega proviene de la capa de servicios web que proporciona el [backend](https://github.com/Ontica/Banobras.PYC.Backend) del Sistema.

## Instalación

Esta aplicación utiliza Angular 17.3.1 y TypeScript 5.2.2, y tiene dependencias que requieren tener instalado Node 18.18.2 o
superior, además de NPM 9.8.1 o superior.

Se recomienda utilizar la versión más reciente de [Visual Studio Code](https://code.visualstudio.com) como editor y compilador del código.

**Primero debe asegurarse de tener instalados Node versión >= 18.18.2 y NPM versión >= 9.8.1**

Después de esto, se requiere instalar [Angular CLI](https://github.com/angular/angular-cli) (globalmente si es posible), asegurándose que se instaló la **versión 17.3.1** o superior.

```bash
# instalar Angular CLI globalmente
npm install -g @angular/cli

# verificar las versiones de Angular CLI, Angular y TypeScript
ng -v
```

El siguiente paso es bajar e instalar éste repositorio de GitHub:

```bash
# clone (o fork) de éste repositorio
git clone https://github.com/Ontica/Banobras.PYC.Frontend

# cambiar de directorio
cd Banobras.PYC.Frontend

# instalar el repositorio utilizando npm
npm install

# utilizar Angular CLI para inicializar el servidor
ng serve --open
```

De forma predeterminada la aplicación web del Sistema PYC se desplegará en [http://localhost:2025](http://localhost:2025).

## Documentación

De acuerdo a las prácticas de desarrollo ágil, la documentación se escribirá e
incluirá en este repositorio en las últimas semanas del proyecto.

## Licencia

Este producto y sus partes se distribuyen mediante una licencia GNU AFFERO
GENERAL PUBLIC LICENSE, para uso exclusivo de BANOBRAS y de su personal, y
también para su uso por cualquier otro organismo en México perteneciente a
la Administración Pública Federal.

Para cualquier otro uso (con excepción a lo estipulado en los Términos de
Servicio de GitHub), es indispensable obtener con nuestra organización una
licencia distinta a esta.

Lo anterior restringe la distribución, copia, modificación, almacenamiento,
instalación, compilación o cualquier otro uso del producto o de sus partes,
a terceros, empresas privadas o a su personal, sean o no proveedores de
servicios de las entidades públicas mencionadas.

El desarrollo, evolución y mantenimiento de este producto está siendo pagado
en su totalidad con recursos públicos, y está protegido por las leyes nacionales
e internacionales de derechos de autor.

## Copyright

Copyright © 2024-2025. La Vía Óntica SC, Ontica LLC y autores.
Todos los derechos reservados.
