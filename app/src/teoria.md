¿Qué conseguimos?
Ahora cada componente tiene una responsabilidad concreta:
- App: administra el estado y la comunicación con el servidor.
- ProductFilters: recibe estados y comunica los cambios al padre.
- ProductTable: recibe productos y los representa.
- Pagination: recibe la página actual y permite modificarla.
Un concepto importante que quiero que recuerdes para el examen: flujo de datos unidireccional. Los estados viven en App, los componentes hijos reciben sus valores mediante props y notifican cambios mediante funciones.