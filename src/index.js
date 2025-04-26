// src/index.js
import "./css/main.css"
import { StrictMode } from "react"
import * as ReactDOMClient from "react-dom/client"
import App from "./App"

// Получаем корневой элемент
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Не удалось найти корневой элемент с id 'app'")

// Создаем React root
const app = ReactDOMClient.createRoot(rootElement)

// Рендерим приложение
app.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
