"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { KeywordHighlight } from "./KeywordHighlight"

interface PoemLineProps {
  originalText: string
  translatedText: string
  showKeywords: boolean
  keywords?: {
    original: string
    translated: string
  }[]
}

export function PoemLine({ originalText, translatedText, showKeywords, keywords = [] }: PoemLineProps) {
  // Function to render a text with highlighted keywords
  function renderHighlightedText(text: string, isOriginal: boolean) {
    // Return original text directly when keywords are not applied.
    if (isOriginal || !showKeywords || !keywords || keywords.length === 0) {
      return text
    }
    
    let result = text
    const parts: React.ReactNode[] = []
    
    // Sort keywords by translated length to avoid overlap.
    const sortedKeywords = [...keywords].sort((a, b) => {
      return b.translated.length - a.translated.length
    })
    
    // Find keyword positions in the translated text.
    const positions: {start: number; end: number; keyword: typeof keywords[0]}[] = []
    
    sortedKeywords.forEach(keyword => {
      const searchText = keyword.translated
      const keywordRegex = new RegExp(searchText, 'g')
      let match
      
      while ((match = keywordRegex.exec(text)) !== null) {
        positions.push({
          start: match.index,
          end: match.index + searchText.length,
          keyword
        })
      }
    })
    
    // Sort by position.
    positions.sort((a, b) => a.start - b.start)
    
    // Remove overlapping ranges.
    const filteredPositions = positions.filter((pos, index, arr) => {
      if (index === 0) return true
      return pos.start >= arr[index - 1].end
    })
    
    // Build output with highlighted keywords.
    let lastEnd = 0
    
    filteredPositions.forEach((pos) => {
      // Add text before the keyword.
      if (pos.start > lastEnd) {
        parts.push(text.substring(lastEnd, pos.start))
      }
      
      // Add highlighted keyword.
      const keyword = pos.keyword
      const originalText = text.substring(pos.start, pos.end)
      
      parts.push(
        <KeywordHighlight 
          key={`${pos.start}-${pos.end}`}
          keyword={keyword.original}
          translation={keyword.translated}
        >
          {originalText}
        </KeywordHighlight>
      )
      
      lastEnd = pos.end
    })
    
    // Append the remaining text.
    if (lastEnd < text.length) {
      parts.push(text.substring(lastEnd))
    }
    
    return parts.length > 0 ? <>{parts}</> : text
  }

  return (
    <div className="flex flex-col gap-1 sm:gap-1.5">
      <div className="text-center text-base sm:text-lg font-normal tracking-wide">
        {renderHighlightedText(originalText, true)}
      </div>
      <div className="text-center text-xs sm:text-sm text-gray-700">
        {renderHighlightedText(translatedText, false)}
      </div>
    </div>
  )
}
