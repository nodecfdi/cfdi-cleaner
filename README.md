# @nodecfdi/cfdi-cleaner

[![Source Code][badge-source]][source]
[![Software License][badge-license]][license]
[![Latest Version][badge-release]][release]
[![Discord][badge-discord]][discord]

[source]: https://github.com/nodecfdi/cfdi-cleaner

[badge-source]: https://img.shields.io/badge/source-nodecfdi%2Fcfdi--cleaner-blue?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMTIgMTIgNDAgNDAiPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMiwxMy40Yy0xMC41LDAtMTksOC41LTE5LDE5YzAsOC40LDUuNSwxNS41LDEzLDE4YzEsMC4yLDEuMy0wLjQsMS4zLTAuOWMwLTAuNSwwLTEuNywwLTMuMiBjLTUuMywxLjEtNi40LTIuNi02LjQtMi42QzIwLDQxLjYsMTguOCw0MSwxOC44LDQxYy0xLjctMS4yLDAuMS0xLjEsMC4xLTEuMWMxLjksMC4xLDIuOSwyLDIuOSwyYzEuNywyLjksNC41LDIuMSw1LjUsMS42IGMwLjItMS4yLDAuNy0yLjEsMS4yLTIuNmMtNC4yLTAuNS04LjctMi4xLTguNy05LjRjMC0yLjEsMC43LTMuNywyLTUuMWMtMC4yLTAuNS0wLjgtMi40LDAuMi01YzAsMCwxLjYtMC41LDUuMiwyIGMxLjUtMC40LDMuMS0wLjcsNC44LTAuN2MxLjYsMCwzLjMsMC4yLDQuNywwLjdjMy42LTIuNCw1LjItMiw1LjItMmMxLDIuNiwwLjQsNC42LDAuMiw1YzEuMiwxLjMsMiwzLDIsNS4xYzAsNy4zLTQuNSw4LjktOC43LDkuNCBjMC43LDAuNiwxLjMsMS43LDEuMywzLjVjMCwyLjYsMCw0LjYsMCw1LjJjMCwwLjUsMC40LDEuMSwxLjMsMC45YzcuNS0yLjYsMTMtOS43LDEzLTE4LjFDNTEsMjEuOSw0Mi41LDEzLjQsMzIsMTMuNHoiLz48L3N2Zz4%3D

[license]: https://github.com/nodecfdi/cfdi-cleaner/blob/master/LICENSE

[badge-license]: https://img.shields.io/github/license/nodecfdi/cfdi-cleaner?logo=open-source-initiative&style=flat-square

[badge-release]: https://img.shields.io/npm/v/@nodecfdi/cfdi-cleaner

[release]: https://www.npmjs.com/package/@nodecfdi/cfdi-cleaner

[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord&style=flat-square

[discord]: https://discord.gg/aFGYXvX

> Library to clean Mexican Digital SAT Invoices.

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de nodecfdi/cfdi-cleaner

Los archivos XML de Comprobantes Fiscales Digitales por Internet (CFDI) suelen contener errores. Esta librería se
encarga de reparar los errores (reparables) conocidos/comunes para poder trabajar con ellos.

Todas las operaciones que realiza esta librería con sobre partes del CFDI que no influyen en la generación de la cadena
de origen ni del sello.

Librería inspirada por la versión para php https://github.com/phpcfdi/cfdi-cleaner

## Instalación

```shell
npm i @nodecfdi/cfdi-cleaner --save
```

o

```shell
yarn add @nodecfdi/cfdi-cleaner
```

## Referencia de uso

La clase de trabajo es `Cleaner` y ofrece los siguientes métodos de limpieza:

### `staticClean(xml: string): string`

Realiza la limpieza de texto y del documento xml a partir de una cadena de caracteres y entrega la representación limpia
también en texto.

Este método es estático, por lo que no se necesita crear una instancia del objeto `Cleaner`.

```ts
import { readFileSync } from 'fs';
import { Cleaner } from '@nodecfdi/cfdi-cleaner';

// Accedemos al contenido en nuestro archivo XML
const xml = readFileSync('archivo-cfdi.xml').toString();
console.log(Cleaner.staticClean(xml));
```

### `cleanStringToString(xml: string): string`

Realiza la limpieza de texto y del documento xml a partir de una cadena de caracteres y entrega la representación limpia
también en texto.

```ts
import { readFileSync } from 'fs';
import { Cleaner } from '@nodecfdi/cfdi-cleaner';

// Accedemos al contenido en nuestro archivo XML
const xml = readFileSync('archivo-cfdi.xml').toString();
const cleaner = new Cleaner();
console.log(cleaner.cleanStringToString(xml));
```

### `cleanStringToDocument(xml: string): Document`

Realiza la limpieza de texto y del documento xml a partir de una cadena de caracteres y entrega el documento XML limpio.

Este método es útil si se necesita utilizar inmediatamente el objeto documento XML.

```ts
import { readFileSync } from 'fs';
import { Cleaner } from '@nodecfdi/cfdi-cleaner';
import { XMLSerializer } from 'xmldom';

// Accedemos al contenido en nuestro archivo XML
const xml = readFileSync('archivo-cfdi.xml').toString();
const cleaner = new Cleaner();
const document = cleaner.cleanStringToDocument(xml);
console.log(new XMLSerializer().serializeToString(document));
```

## Acciones de limpieza

Hay dos tipos de limpiezas que se pueden hacer, una sobre el texto XML antes de que se intente cargar como objetos DOM,
y la otra una vez que se pudo cargar el contenido como objetos DOM.

### Limpiezas sobre el texto XML

Estos limpiadores deben ejecutarse antes de intentar leer el contenido XML y están hechos para prevenir que el objeto
documento XML no se pueda crear.

#### `RemoveNonXmlStrings`

Elimina todo contenido antes del primer carácter `<` y posterior al último `>`.

#### `SplitXmlDeclarationFromDocument`

Separa por un `LF` (`"\n"`) la declaración XML `<?xml version="1.0"?>` del cuerpo XML.

#### `AppendXmlDeclaration`

Agrega `<?xml version="1.0"?>` al inicio del archivo si no existe, es muy útil porque las herramientas de detección
de `MIME` no reconocen un archivo XML si no trae la cabecera.

#### `XmlNsSchemaLocation`

Elimina un error frecuentemente encontrado en los CFDI emitidos por el SAT donde dice `xmlns:schemaLocation`
en lugar de `xsi:schemaLocation`.

### Limpiezas sobre el documento XML (`DOMDocument`)

Estas limpiezas se realizan sobre el documento XML.

#### `RemoveAddenda`

Remueve cualquier nodo de tipo `Addenda` en el espacio de nombres `http://www.sat.gob.mx/cfd/3`.

#### `RemoveIncompleteSchemaLocations`

Actúa sobre cada uno de los `xsi:schemaLocations`.

Lee el contenido e intenta interpretar el espacio de nombres y la ubicación del esquema de validación. Para considerar
que es un esquema de validación verifica que termine con `.xsd` (insensible a mayúsculas o minúsculas). Si encuentra un
espacio de nombres sin esquema lo omite. Si encuentra un esquema sin espacio de nombres lo omite.

#### `RemoveNonSatNamespacesNodes`

Verifica todas las definiciones de espacios de nombres y si no pertenece a un espacio de nombres con la URI
`http://www.sat.gob.mx/**` entonces elimina los nodos y atributos relacionados.

#### `RemoveNonSatSchemaLocations`

Actúa sobre cada uno de los `xsi:schemaLocations`.

Verifica las definiciones de espacios de nombres y elimina todos los pares donde el espacio de nombres que no
correspondan a la URI `http://www.sat.gob.mx/**`.

#### `RemoveUnusedNamespaces`

Remueve todas las declaraciones de espacios de nombres cuando no correspondan a la URI `http://www.sat.gob.mx/**`, por
ejemplo `xmlns:foo="http://tempuri.org/foo"`.

#### `RenameElementAddPrefix`

Agrega el prefijo al nodo que no lo tiene por estar utilizando la definición simple `xmlns`. Además elimina los
namespace superfluos y las definiciones `xmlns` redundantes.

Ejemplo de CFDI sucio:

```xml

<cfdi:Comprobante xmlns="http://www.sat.gob.mx/cfd/4" xmlns:cfdi="http://www.sat.gob.mx/cfd/4">
    <Emisor xmlns="http://www.sat.gob.mx/cfd/4"/>
    <cfdi:Receptor xmlns:cfdi="http://www.sat.gob.mx/cfd/4"/>
</cfdi:Comprobante>
```

Ejemplo de CFDI limpio:

```xml

<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4">
    <cfdi:Emisor/>
    <cfdi:Receptor/>
</cfdi:Comprobante>
```

#### `MoveNamespaceDeclarationToRoot`

Mueve todas las declaraciones de espacios de nombres al nodo raíz.

Por lo regular el SAT pide en la documentación técnica que los espacios de nombres se definan en el nodo raíz, sin
embargo es frecuente que se definan en el nodo que los implementa.

Hay casos extremos de CFDI que siguen las reglas de XML, pero que no siguen las reglas de CFDI y generan prefijos que se
superponen. En este caso, se moverán solamente los espacios de nombres que no se superponen, por ejemplo:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">
    <cfdi:Complemento>
        <cfdi:Otro xmlns:cfdi="http://www.sat.gob.mx/otro"/>
        <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital"/>
    </cfdi:Complemento>
</cfdi:Comprobante>
```

Genera el siguiente resultado:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital">
    <cfdi:Complemento>
        <cfdi:Otro xmlns:cfdi="http://www.sat.gob.mx/otro"/>
        <tfd:TimbreFiscalDigital/>
    </cfdi:Complemento>
</cfdi:Comprobante>
```

Ante un caso como el anterior, no se están siguiendo las reglas establecidas en el Anexo 20 y en el complemento. Es
mejor que siempre considere ese caso como un CFDI inválido, aun cuando se haya firmado, y solicite la sustitución por un
CFDI que sí contenga los prefijos de los espacios de nombres correctos.

#### `MoveSchemaLocationsToRoot`

Mueve todas las declaraciones de ubicaciones de archivos de esquema al nodo principal.

Por lo regular el SAT pide en la documentación técnica que las ubicaciones de archivos de esquema se definan en el nodo
principal, sin embargo es frecuente que se definan en el nodo que los implementa.

#### `SetKnownSchemaLocations`

Verifica que las ubicaciones de los esquemas de espacios de nombres conocidos sean exactamente las direcciones
conocidas, en caso de no serlo las modifican.

Anteriormente el SAT permitía que las ubicaciones de los esquemas de espacios de nombres estuvieran escritos sin
sensibilidad a mayúsculas o minúsculas, incluso tenía varias ubicaciones para obtener estos archivos. Sin embargo,
recientemente ha eliminado la tolerancia a estas ubicaciones y solo permite las definiciones oficiales.

Este limpiador tiene la información de espacio de nombres, versión a la que aplica y ubicación conocida con base en el
proyecto [phpcfdi/sat-ns-registry](https://github.com/phpcfdi/sat-ns-registry).

En caso de que no se encuentre la ruta conocida para un espacio de nombres entonces no aplicará ninguna corrección y
dejará el valor tal como estaba.

#### `CollapseComplemento`

Este limpiador se crea para solventar la inconsistencia en la documentación del SAT.

Por un lado, en el Anexo 20 de CFDI 3.3, el SAT exige que exista uno y solamente un nodo `cfdi:Complemento`. Sin
embargo, en el archivo de validación XSD permite que existan más de uno.

Con esta limpieza, se deja un solo `cfdi:Complemento` con todos los complementos en él.
