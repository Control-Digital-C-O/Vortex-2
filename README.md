# Vortex-2

Una herramienta modular para integrar dentro de páginas webs para tener fácilmente y personalizable un live chat

## Estructura

La carpeta Client es para React y la carpeta server es destinada a Node js

## Uso del proyecto para modo desarrollo

Para poder levantar el proyecto en el modo de desarrollo local para poder gestion y testear las modificaciones e implementaciones. Se debe de levantar un host o servidor local pero para anular la necesidad de la configuracion y de descargar programas con versiones especificas, se utiliza docker.

Tip: si no quieren ver los logs pero quieren que ejecute el servidor, agregen un `-d` al final del comando para levantar el servidor, pero para apagar el host, tendra que utilizar el ultimo comando de abajo.

Para levantar solamente la parte del cliente:

~~~ bash
docker compose -f docker-compose.client.yml up --build
~~~

Para levantar solamente la parte del servidor:

~~~ bash
docker compose -f docker-compose.server.yml up --build
~~~

Para levantar el servidor completo (client + server):

~~~ bash
docker compose up --build
~~~

Caso para apagar los contenedores es "ctrl + C" (suele quedar con los logs del contenedor)

~~~ bash
docker compose down
~~~

## Codigo del uso de modulos como una clase

Esto permite manejar los modulos de server como parte de la funcion dynamicImport, al mencionarla como module

~~~ javascript
// src/utils/dynamicImport.js
export async function dynamicImport(moduleName) {
  try {
    const module = await import(`/modules/${moduleName}.js`); // Importa el módulo completo

    // Si el módulo tiene una exportación por defecto que es una clase, la usamos directamente
    if (typeof module.default === "function") {
      return new module.default(); // Retorna una instancia de la clase
    }

    // Envolvemos las exportaciones en una estructura jerárquica usando puntos
    return new ModuleWrapper(module);
  } catch (error) {
    console.error(`Error al cargar el módulo ${moduleName}:`, error);
    throw error;
  }
}

// Clase genérica para envolver funciones y variables exportadas en una estructura jerárquica
class ModuleWrapper {
  constructor(moduleExports) {
    this.module = {};

    Object.entries(moduleExports).forEach(([key, value]) => {
      // Si es una función, la agregamos bajo el nombre jerárquico
      if (typeof value === "function") {
        this.addFunction(key, value);
      } else {
        // Si es cualquier otra cosa (variable, objeto), lo agregamos tal cual
        this.addProperty(key, value);
      }
    });
  }

  // Agrega funciones al objeto con un formato jerárquico
  addFunction(path, fn) {
    const keys = path.split(".");
    let current = this.module;

    // Recorre el path y crea los objetos intermedios si es necesario
    keys.forEach((key, index) => {
      if (!current[key]) {
        current[key] = index === keys.length - 1 ? fn : {}; // Si es el último, asignamos la función
      }
      current = current[key]; // Navegamos al siguiente nivel
    });
  }

  // Agrega propiedades de manera jerárquica
  addProperty(path, value) {
    const keys = path.split(".");
    let current = this.module;

    keys.forEach((key, index) => {
      if (!current[key]) {
        current[key] = index === keys.length - 1 ? value : {}; // Si es el último, asignamos la propiedad
      }
      current = current[key]; // Navegamos al siguiente nivel
    });
  }
}
~~~

### Caso de uso

#### Clases

Digamos que tenemos un archivo llamado test.js

Ejemplo:

~~~ javascript
// Exporta una clase
export default class Test {
  hola() {
    return "Hola desde la clase Test";
  }
}
~~~

En React lo usariamos de la siguiente manera en App.jsx:

~~~javascript
useEffect(() => {
  async function loadModule() {
    const module = await dynamicImport("test");
    console.log(module.test.hola()); // Salida: Hola desde la clase Test
  }
  loadModule();
}, []);
~~~

Nos permite usar un modulo con clase para almacenarlo en la varible con clases llamada "module".

#### Funciones o variables

En este caso, si usamos funciones o variables podemos hacerlo de la siguiente manera:

Ejemplo:

~~~javascript
// Exporta funciones para operaciones matemáticas
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

~~~

Y las podemos reutilizar con la clase module para el resto del proyecto.

~~~javascript
useEffect(() => {
  async function loadModule() {
    const module = await dynamicImport("math");
    console.log(module.math.add(5, 3)); // Salida: 8
    console.log(module.math.subtract(5, 3)); // Salida: 2
  }
  loadModule();
}, []);

~~~

Gracias a la variable de "module" nos permite reutilizar codigo muy rapidamente, pero si se necesita extraer de la funcion useEffect, se recomienda almacenar en una varibale global para extraer los datos necesarios.

Un ejemplo mas con variables:

~~~javascript
export const appName = "Mi App";
export const version = "1.0.0";
~~~

Uso:

~~~javascript
useEffect(() => {
  async function loadModule() {
    const module = await dynamicImport("config");
    console.log(module.config.appName); // Salida: Mi App
    console.log(module.config.version); // Salida: 1.0.0
  }
  loadModule();
}, []);
~~~
