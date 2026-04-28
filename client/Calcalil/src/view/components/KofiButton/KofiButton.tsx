import { useEffect, useRef } from 'react'
import styles from './KofiButton.module.scss'

let instanceCounter = 0

const KofiButton = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceId = useRef(`kofi-container-${instanceCounter++}`)
  const initialized = useRef(false)

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return
    initialized.current = true

    const loadWidget = () => {
      if (window.kofiwidget2 && containerRef.current) {
        // Create the button HTML manually
        const button = document.createElement('a')
        button.href = 'https://ko-fi.com/T6T41YAWB9'
        button.target = '_blank'
        button.className = 'kofi-button'
        button.style.cssText = `
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #72a4f2;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-family: 'Heebo', sans-serif;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        `
        button.onmouseover = () => {
          button.style.transform = 'translateY(-2px)'
          button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
        button.onmouseout = () => {
          button.style.transform = 'translateY(0)'
          button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
        }

        // Add Ko-fi icon
        const icon = document.createElement('span')
        icon.textContent = '☕'
        icon.style.fontSize = '18px'
        
        // Add text
        const text = document.createElement('span')
        text.textContent = 'Support me on Ko-fi'
        
        button.appendChild(icon)
        button.appendChild(text)
        
        // Clear container and add button
        containerRef.current.innerHTML = ''
        containerRef.current.appendChild(button)
      }
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="ko-fi"]')
    
    if (!existingScript) {
      // Load Ko-fi widget script
      const script = document.createElement('script')
      script.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js'
      script.async = true
      script.onload = loadWidget
      document.body.appendChild(script)
    } else {
      loadWidget()
    }
  }, [])

  return <div ref={containerRef} id={instanceId.current} className={styles.kofiButton}></div>
}

// Declare Ko-fi widget type for TypeScript
declare global {
  interface Window {
    kofiwidget2: any
  }
}

export default KofiButton
