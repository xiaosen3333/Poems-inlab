"use client"

import { Button } from "@/components/ui/button"
import { PoemLine } from "./PoemLine"
import { PoemData } from "@/lib/data/poems"

interface PoemTabProps {
  poem: PoemData
  markedKeywords: boolean
  toggleKeywords: () => void
}

export function PoemTab({ poem, markedKeywords, toggleKeywords }: PoemTabProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start py-4 w-full overflow-y-auto opacity-100 visible">
      <div className="mb-4 sm:mb-6 text-center">
        <div className="text-xl sm:text-2xl mb-1">«{poem.title.original}»</div>
        <div className="text-lg sm:text-xl">{poem.title.translated}</div>
      </div>

      <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600 text-center">
        <div>{poem.author.dynasty} · {poem.author.name}</div>
        <div>Li Bai</div>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {poem.verses.map((verse, index) => (
          <PoemLine
            key={index}
            originalText={verse.original}
            translatedText={verse.translated}
            showKeywords={markedKeywords}
            keywords={verse.keywords}
          />
        ))}
      </div>

      <div className="mt-6 sm:mt-8 flex justify-center">
        <Button
          variant="outline"
          className="rounded-full px-6 sm:px-8 py-2 sm:py-2.5 bg-[#9747FF] hover:bg-[#8440EA] text-white border-none text-xs sm:text-sm shadow-sm"
          onClick={toggleKeywords}
        >
          Mark Keywords
        </Button>
      </div>
    </div>
  )
}