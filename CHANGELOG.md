# @nodecfdi/cfdi-cleaner

## 1.4.2

### Patch Changes - Maintenance and Small Optimizations

- Update dependencies
- Update types exports for typescript module and commonjs
- Update to ESM support
- Update CI workflow for fix pipeline to latest github and pnpm changes
- Increment code coverage
- Drop support to node versions < 16

## 1.4.1

### Patch Changes - Change export for build process using bundlers

- Resolve exports for usage with bundlers like a vite|rollup
- Update dependencies

## 1.4.0

### Change build tool from microbundle to rollup

- Change build tool
- Update dependencies
- Added api-extractor for check types `.d.ts`
- Replace microbundle to rollup
- Replace jest for vitest (added support to multiple environment tests like a node or browser env)
- Added all required test for browser
- Resolve potentials bugs on browser

### Exclude cleaners

- Added option to exclude specific cleaners

## Version 1.3.0

### DOM Agnostic>

Se agrega soporte a DOM Agnostic resaltando que para su correcto funcionamiento se debera hacer uso de la libreria común `@nodecfdi/cfdiutils-common` y su método install para proporcionarle nuestra lib preferida de gestión de DOM. Antes del uso de cfdi-cleaner.

```ts
import { install } from '@nodecfdi/cfdiutils-common';

install(domParserInstance, xmlSerializerInstance, domImplementationInstance);
```

### CI

- Se actualizan los workflow para usar pnpm y se refactorizan métodos para cumplir con un mayor coverage.
- Se agrega Sonarcloud para una mejor calidad de código.

### Build

- Se cambia Rollup bundle por microbundle para la generación de la libreria.

## Version 1.2.3

- Se agrega soporte para namespaces de cfdi4.0 donde en la busqueda de xpath no consideraba los casos de cfdi namespace para 4.0
- Se corrige remove addendas para considerar el caso donde se desea remover la adenda de cfdi4.0
- Se renombre clase Interna puesto que ahora no solo es una busqueda de xpath en 3.x si no que tambien 4.

## Version 1.2.2

- Se corrige `XmlAttributeMethodsTrait` estaba borrando temporalmente un valor en el atributo cuando se esperaba que lo borrara permanentemente, lo que ocasionaba que al consultar nuevamente el valor del atributo se siguiera mostrando el valor anterior. De la misma manera se agrega un test que confirma que ya no ocurra dicho problema.
- Actualización de dependencias.

## Version 1.2.1

- Se corrige `XmlNamespaceMethosTrait` estaba retornando en algunos casos específicos namespaceNodes que no eran
    namespaces, haciendo que al iterar sobre ellos se consideraran atributos no namespace como namespace.
- Se actualiza `SetKnownSchemaLocations` dado que se agrego un espacio conocido IngresosHidrocarburos 1.0.
- Actualización de dependencias.

## Versión 1.2.0

### Definición de XML namespace duplicado pero sin uso

Se han encontrado casos donde hay CFDI que incluyen un namespace que está en uso pero con un prefijo sin uso.

En el siguiente ejemplo, el espacio de nombres `http://www.sat.gob.mx/TimbreFiscalDigital` está declarado con el
prefijo `nsx` y `tfd`, donde el primer prefijo no está en uso y el segundo sí.

```xml

<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"
                  xmlns:nsx="http://www.sat.gob.mx/TimbreFiscalDigital"
                  xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital">
    <tfd:TimbreFiscalDigital UUID="X"/>
</cfdi:Comprobante>
```

Se ha modificado el limpiador `RemoveUnusedNamespaces` para que cuando detecta si un espacio de nombres está en uso
detecte también el prefijo. Con este cambio, el resultado de la limpieza sería:

```xml

<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"
                  xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital">
    <tfd:TimbreFiscalDigital UUID="X"/>
</cfdi:Comprobante>
```

### Definición de XML namespace duplicado y sin prefijo

Se han encontrado casos donde hay CFDI _sucios_, pero válidos, donde la definición de los nodos no cuenta con un
prefijo. En estos casos el limpiador está produciendo un CFDI inválido después de limpiar.

Para corregir este problema:

- Se elimina de la lista de limpiadores de texto por defecto a `RemoveDuplicatedCfdi3Namespace`.
- Se quita la funcionalidad de `RemoveDuplicatedCfdi3Namespace` y se emite un `console.warn`.
- Se crea un nuevo limpiador `RenameElementAddPrefix` que agrega el prefijo al nodo que no lo tiene por estar utilizando
    la definición simple `xmlns`. Además elimina los namespace superfluos y las definiciones `xmlns` redundantes.

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

### El limpiador `RemoveDuplicatedCfdi3Namespace` ha sido deprecado

El limpiador `RemoveDuplicatedCfdi3Namespace` ha sido deprecado porque existen casos con un XML válido, pero sucio, y el
limpiador convierte el CFDI en inválido. La funcionalidad será absorvida por otro limpiador.

CFDI con XML correcto, pero sucio:

```xml

<cfdi:Comprobante xmlns="http://www.sat.gob.mx/cfd/3" xmlns:cfdi="http://www.sat.gob.mx/cfd/3">
    <Emisor xmlns="http://www.sat.gob.mx/cfd/3"/>
</cfdi:Comprobante>
```

Resultado del limpiador, donde `Emisor` ahora no pertenece al espacio de nombres `http://www.sat.gob.mx/cfd/3`. El XML
es correcto, pero como CFDI ya no lo es:

```xml

<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">
    <Emisor/>
</cfdi:Comprobante>
```

### Mejoras al manejo interno de definiciones de espacios de nombres XML

Se modificó el _trait_ `XmlNamespaceMethodsTrait` para que detectara si un elemento de espacios de nombres
`DOMNameSpaceNode` está eliminado revisando si la propiedad `namespaceURI` es `NULL`. Antes se validaba contra la
propiedad `nodeValue`, pero esta propiedad puede ser vacía, por ejemplo en `xmlns=""`.

Al momento de verificar si un espacio de nombres es reservado, ya no se excluye cuando el espacio de nombres es vacío.

### Eliminación de definición de espacio de nombres sin prefijo

Se modificó el _trait_ `XmlNamespaceMethodsTrait` para que pueda eliminar un espacio de nombres sin prefijo, por
ejemplo `xmlns="http://tempuri.org/root"` o `xmlns=""`.

## Versión 1.1.2

- Se actualiza la lista de espacios de nombres conocidos para:
  - Cfdi 4.0
  - Cfdi de retenciones e información de pagos 2.0
  - Complemento de pagos 2.0
  - Complemento de carta porte 1.0
  - Complemento de carta porte 2.0
- Se agrega una prueba que usa <https://github.com/phpcdi/sat-ns-registry> para verificar que la lista se mantiene
    actualizada.

## Versión 1.1.1

- Se corrige `MoveNamespaceDeclarationToRoot` estaba generando una salida de XML no válida, mantenía la definición de
    Namespace cuando este ya se encontraba definido en el Nodo padre, por ejemplo se esperaba
    que `<cfdi:Complemento xmlns:cfdi="http://www.sat.gob.mx/cfd/3">` se removiera quedando solo `<cfdi:Complemento>`.
- Se agrega un test que comprueba dicho caso.

## Versión 1.1.0

- Added ES6 and Rollup support
- Browser support
- Updated dependencies
