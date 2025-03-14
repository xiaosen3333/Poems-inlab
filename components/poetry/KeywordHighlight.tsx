"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface KeywordHighlightProps {
  keyword: string
  translation: string
  children: React.ReactNode
}

export function KeywordHighlight({ keyword, translation, children }: KeywordHighlightProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="bg-yellow-100 text-yellow-800 px-1 rounded cursor-help font-medium">{children}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white px-3 py-1.5 text-sm">
          <p>{keyword}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}