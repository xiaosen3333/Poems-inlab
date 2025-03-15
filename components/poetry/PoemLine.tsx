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
    // 如果是原文(中文)或没有关键词，或关键词未标记，直接返回原文本
    if (isOriginal || !showKeywords || !keywords || keywords.length === 0) {
      return text
    }
    
    let result = text
    const parts: React.ReactNode[] = []
    
    // 仅对翻译文本(英文)进行关键词排序
    const sortedKeywords = [...keywords].sort((a, b) => {
      return b.translated.length - a.translated.length
    })
    
    // 找出所有关键词位置
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
    
    // 按位置排序
    positions.sort((a, b) => a.start - b.start)
    
    // 过滤掉重叠的位置
    const filteredPositions = positions.filter((pos, index, arr) => {
      if (index === 0) return true
      return pos.start >= arr[index - 1].end
    })
    
    // 构建带有高亮关键词的结果
    let lastEnd = 0
    
    filteredPositions.forEach((pos) => {
      // 添加关键词前的文本
      if (pos.start > lastEnd) {
        parts.push(text.substring(lastEnd, pos.start))
      }
      
      // 添加高亮关键词
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
    
    // 添加剩余文本
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