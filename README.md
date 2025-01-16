# Vortex-2

Una herramienta modular para integrar dentro de páginas webs para tener fácilmente y personalizable un live chat

## Estructura

La carpeta Client es para React y la carpeta server es destinada a Node js

## Uso del proyecto para modo desarrollo

~~~ bash
docker compose -f docker-compose.client.yml up --build
~~~

~~~ bash
docker compose -f docker-compose.server.yml up --build
~~~

~~~ bash
docker compose up --build
~~~

Caso para apagar los contenedores es "ctrl + C".

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
    if (typeof module.default === 'function') {
      return new module.default(); // Retorna una instancia de la clase
    }

    // Envolvemos las exportaciones en una clase genérica
    return new ModuleWrapper(module);
  } catch (error) {
    console.error(`Error al cargar el módulo ${moduleName}:`, error);
    throw error;
  }
}

// Clase genérica para envolver funciones y variables exportadas
class ModuleWrapper {
  constructor(moduleExports) {
    Object.entries(moduleExports).forEach(([key, value]) => {
      if (typeof value === 'function') {
        // Si es una función, la envolvemos para que se pueda llamar
        this[key] = (...args) => value(...args);
      } else {
        // Si es cualquier otra cosa, la asignamos como propiedad
        this[key] = value;
      }
    });
  }
}
~~~

### Caso de uso

#### Clases

Digamos que tenemos un archivo llamado test.js

Ejemplo:

~~~ javascript
export default class Test {
  constructor() {
    this.message = 'Hola desde la clase Test';
  }

  hola(name) {
    return `Hola, ${name}!`;
  }
}
~~~

En React lo usariamos de la siguiente manera en App.jsx:

~~~javascript
useEffect(() => {
  async function loadModule() {
    const module = await dynamicImport('test');
    console.log(module.hola('Matías')); // Hola, Matías!
  }

  loadModule();
}, []);
~~~

Nos permite usar un modulo con clase para almacenarlo en la varible con clases llamada "module".

#### Funciones o variables

En este caso, si usamos funciones o variables podemos hacerlo de la siguiente manera:

Ejemplo:

~~~javascript
export const sumar = (a, b) => a + b;
export const restar = (a, b) => a - b;
export const PI = 3.14159;
~~~

Y las podemos reutilizar con la clase module para el resto del proyecto.

~~~javascript
useEffect(() => {
  async function loadModule() {
    const module = await dynamicImport('utils');
    console.log(module.sumar(5, 3)); // 8
    console.log(module.restar(10, 4)); // 6
    console.log(module.PI); // 3.14159
  }

  loadModule();
}, []);
~~~

Gracias a la variable de "module" nos permite reutilizar codigo muy rapidamente, pero si se necesita extraer de la funcion useEffect, se recomienda almacenar en una varibale global para extraer los datos necesarios.

## Codigo para el uso del server

~~~ javascript
import React, { useEffect, useState } from "react";

const App = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Importar dinámicamente desde el servidor
    import("http://localhost:3000/modules/math.js")
      .then(({ add }) => {
        const sum = add(5, 3);
        setResult(sum); // Resultado: 8
      })
      .catch((err) => console.error("Error al cargar el módulo:", err));
  }, []);

  return (
    <div>
      <h1>React y Node.js Modular</h1>
      <p>Resultado de la suma: {result}</p>
    </div>
  );
};

export default App;
~~~
