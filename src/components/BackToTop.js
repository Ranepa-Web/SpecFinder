"use client"

import { useState, useEffect } from "react"

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Показываем кнопку, когда пользователь прокрутил страницу на 300px вниз
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Прокрутка страницы вверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className={`back-to-top ${isVisible ? "visible" : ""}`} onClick={scrollToTop} title="Наверх">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </div>
  )
}

export default BackToTop
