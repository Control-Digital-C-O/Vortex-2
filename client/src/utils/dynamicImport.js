// src/utils/dynamicImport.js
export async function dynamicImportWithParams(
  moduleName,
  functionName,
  ...params
) {
  try {
    const module = await import(`/modules/${moduleName}.js`);
    if (module[functionName]) {
      return module[functionName](...params); // Llama la función con los parámetros
    } else {
      throw new Error(
        `La función ${functionName} no existe en el módulo ${moduleName}`
      );
    }
  } catch (error) {
    console.error(`Error al cargar el módulo ${moduleName}:`, error);
    throw error;
  }
}
