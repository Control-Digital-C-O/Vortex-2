import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { dynamicImport } from './utils/dynamicImport'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    async function loadModule() {
      try {
        const module = await dynamicImport('test');
        console.log(module.test.hola());
      } catch (error) {
        console.error('Error al usar el módulo remoto:', error);
      }
    }

    loadModule();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p>año 2025, me aceptaron en Alura</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App