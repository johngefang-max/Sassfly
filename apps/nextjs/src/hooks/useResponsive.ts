'use client'

import { useState, useEffect } from 'react'

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })

      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
      setIsDesktop(window.innerWidth >= 1024)
    }

    // Set initial size
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
  }
}