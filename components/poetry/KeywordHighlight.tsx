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
          <span className="relative cursor-help group bg-transparent">
            <span className="relative z-10 text-yellow-800 inline-block">{children}</span>
            <span className="absolute inset-0 bg-yellow-100 opacity-70 rounded" style={{ margin: '-1px -2px', padding: '1px 2px' }}></span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white px-3 py-1.5 text-sm">
          <p>{keyword}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}