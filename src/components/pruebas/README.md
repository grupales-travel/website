# Carpeta de Componentes de Pruebas (Sandbox)

Esta carpeta (`website/src/components/pruebas/`) está reservada para crear y ensayar componentes nuevos o rediseños de secciones existentes sin modificar los componentes en producción de `website/src/components/home/`.

### Flujo de trabajo recomendado:
1. **Crear o duplicar componente aquí**: ej. `website/src/components/pruebas/HeroSectionTest.tsx`
2. **Importarlo y probarlo en la página de pruebas**: `website/src/app/pruebas/page.tsx`
3. **Revisar en vivo**: `http://localhost:3000/pruebas` y comparar con `http://localhost:3000/`
4. **Una vez aprobado**: Se pasa el código o se reemplaza en el componente oficial de producción (`website/src/components/home/`).
