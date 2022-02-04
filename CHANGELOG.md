# @nodecfdi/cfdi-cleaner

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
