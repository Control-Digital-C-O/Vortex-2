// src/utils/dynamicImport.js
export async function dynamicImport(moduleName) {
  try {
    const module = await import(`/src/modules/${moduleName}.js`); // Importa el módulo completo

    // Si el módulo tiene una exportación por defecto que es una clase, la usamos directamente
    if (module.default && typeof module.default === "function") {
      const instance = new module.default(); // Crea una instancia de la clase
      return { [moduleName]: instance }; // Envuelve en un objeto con el nombre del módulo
    }

    // Si no es una clase, construimos el wrapper jerárquico
    return { [moduleName]: new ModuleWrapper(module).module };
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
      if (typeof value === "function") {
        this.addToHierarchy(key, value); // Agrega funciones
      } else {
        this.addToHierarchy(key, value); // Agrega variables u objetos
      }
    });
  }

  // Método genérico para agregar elementos a la jerarquía
  addToHierarchy(path, value) {
    const keys = path.split(".");
    let current = this.module;

    keys.forEach((key, index) => {
      if (!current[key]) {
        current[key] = index === keys.length - 1 ? value : {}; // Asigna la propiedad al último nivel
      }
      current = current[key];
    });
  }
}
