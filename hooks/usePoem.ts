"use client"

import { useState, useCallback } from "react"
import { PoemData } from "@/lib/data/poems"

export function usePoem(poemData: PoemData) {
  // State for poem interaction
  const [markedKeywords, setMarkedKeywords] = useState(false)
  
  // Toggle keyword highlighting
  const toggleKeywords = useCallback(() => {
    setMarkedKeywords(prev => !prev)
  }, [])

  return {
    poem: poemData,
    markedKeywords,
    toggleKeywords
  }
}