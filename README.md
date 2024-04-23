# `@nodecfdi/cfdi-cleaner`

[![Source Code][badge-source]][source]
[![Npm Node Version Support][badge-node-version]][node-version]
[![Discord][badge-discord]][discord]
[![Latest Version][badge-release]][release]
[![Software License][badge-license]][license]
[![Build Status][badge-build]][build]
[![Reliability][badge-reliability]][reliability]
[![Maintainability][badge-maintainability]][maintainability]
[![Code Coverage][badge-coverage]][coverage]
[![Violations][badge-violations]][violations]
[![Total Downloads][badge-downloads]][downloads]

> Library to clean Mexican Digital SAT Invoices.

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de `@nodecfdi/cfdi-cleaner`

Los archivos XML de Comprobantes Fiscales Digitales por Internet (CFDI) suelen contener errores. Esta librería se
encarga de reparar los errores (reparables) conocidos/comunes para poder trabajar con ellos.

Todas las operaciones que realiza esta librería con sobre partes del CFDI que no influyen en la generación de la cadena
de origen ni del sello.

Librería inspirada por la versión para php <https://github.com/phpcfdi/cfdi-cleaner>

## Instalación

NPM

```bash
npm i @nodecfdi/cfdi-core @nodecfdi/cfdi-cleaner --save
```

YARN

```bash
yarn add @nodecfdi/cfdi-core @nodecfdi/cfdi-cleaner
```

PNPM

```bash
pnpm add @nodecfdi/cfdi-core @nodecfdi/cfdi-cleaner
```

## Documentación

La documentación está disponible en el [Sitio Web NodeCfdi](https://nodecfdi.com)

## Soporte

Puedes obtener soporte abriendo un ticket en Github.

Adicionalmente, esta librería pertenece a la comunidad [OcelotlStudio](https://ocelotlstudio.com), así que puedes usar los mismos canales de comunicación para obtener ayuda de algún miembro de la comunidad.

## Compatibilidad

Esta librería se mantendrá compatible con al menos la versión con
[soporte activo de Node](https://nodejs.org/es/about/releases/) más reciente.

También utilizamos [Versionado Semántico 2.0.0](https://semver.org/lang/es/) por lo que puedes usar esta librería sin temor a romper tu aplicación.

## Contribuciones

Las contribuciones con bienvenidas. Por favor lee [CONTRIBUTING][] para más detalles y recuerda revisar el archivo [CHANGELOG][].

## Copyright and License

The `@nodecfdi/cfdi-cleaner` library is copyright © [NodeCfdi](https://github.com/nodecfdi) - [OcelotlStudio](https://ocelotlstudio.com) and licensed for use under the MIT License (MIT). Please see [LICENSE][] for more information.

[contributing]: https://github.com/nodecfdi/.github/blob/main/docs/CONTRIBUTING.md
[changelog]: https://github.com/nodecfdi/cfdi-cleaner/blob/main/CHANGELOG.md
[source]: https://github.com/nodecfdi/cfdi-cleaner
[node-version]: https://www.npmjs.com/package/@nodecfdi/cfdi-cleaner
[discord]: https://discord.gg/AsqX8fkW2k
[release]: https://www.npmjs.com/package/@nodecfdi/cfdi-cleaner
[license]: https://github.com/nodecfdi/cfdi-cleaner/blob/main/LICENSE.md
[build]: https://github.com/nodecfdi/cfdi-cleaner/actions/workflows/build.yml?query=branch:main
[reliability]: https://sonarcloud.io/component_measures?id=nodecfdi_cfdi-cleaner&metric=Reliability
[maintainability]: https://sonarcloud.io/component_measures?id=nodecfdi_cfdi-cleaner&metric=Maintainability
[coverage]: https://sonarcloud.io/component_measures?id=nodecfdi_cfdi-cleaner&metric=Coverage
[violations]: https://sonarcloud.io/project/issues?id=nodecfdi_cfdi-cleaner&resolved=false
[downloads]: https://www.npmjs.com/package/@nodecfdi/cfdi-cleaner
[badge-source]: https://img.shields.io/badge/source-nodecfdi/cfdi--cleaner-blue.svg?logo=github
[badge-node-version]: https://img.shields.io/node/v/@nodecfdi/cfdi-cleaner.svg?logo=nodedotjs
[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord
[badge-release]: https://img.shields.io/npm/v/@nodecfdi/cfdi-cleaner.svg?logo=npm
[badge-license]: https://img.shields.io/github/license/nodecfdi/cfdi-cleaner.svg?logo=open-source-initiative
[badge-build]: https://img.shields.io/github/actions/workflow/status/nodecfdi/cfdi-cleaner/build.yml?branch=main&logo=github-actions
[badge-reliability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_cfdi-cleaner&metric=reliability_rating
[badge-maintainability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_cfdi-cleaner&metric=sqale_rating
[badge-coverage]: https://img.shields.io/sonar/coverage/nodecfdi_cfdi-cleaner/main?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-violations]: https://img.shields.io/sonar/violations/nodecfdi_cfdi-cleaner/main?format=long&logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-downloads]: https://img.shields.io/npm/dm/@nodecfdi/cfdi-cleaner.svg?logo=npm
