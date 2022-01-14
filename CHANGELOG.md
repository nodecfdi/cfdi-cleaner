# @nodecfdi/cfdi-cleaner

## Versión 1.1.1

- Se corrige `MoveNamespaceDeclaratioToRoot` estaba generando una salida de XML no válida, mantenía la definición de
  Namespace cuando este ya se encontraba definido en el Nodo padre, por ejemplo se esperaba
  que `<cfdi:Complemento xmlns:cfdi="http://www.sat.gob.mx/cfd/3">` se removiera quedando solo `<cfdi:Complemento>`.
- Se agrega un test que comprueba dicho caso.

## Versión 1.1.0

- Added ES6 and Rollup support
- Browser support
- Updated dependencies
