"use client";

import { Button } from "@/components/ui/button";
import { PoemLine } from "./PoemLine";
import { PoemData } from "@/lib/data/poems";

interface PoemTabProps {
  poem: PoemData;
  markedKeywords: boolean;
  toggleKeywords: () => void;
}

export function PoemTab({
  poem,
  markedKeywords,
  toggleKeywords,
}: PoemTabProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center py-2 w-full overflow-y-auto opacity-100 visible">
      <h2 className="text-xl sm:text-2xl font-medium mb-5 sm:mb-6 text-center">
        Poetry Showcase
      </h2>
      {poem.title.original ? (
        <div className="mb-2 sm:mb-3 text-center">
          <div className="text-lg sm:text-xl mb-0.5">
            «{poem.title.original}»
          </div>
          <div className="text-base sm:text-lg">{poem.title.translated}</div>
        </div>
      ) : (
        <></>
      )}

      <div className="mb-2 sm:mb-3 text-xs text-gray-600 text-center">
        <div>
          {poem.author.dynasty} · {poem.author.name}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
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

      <div className="mt-3 sm:mt-4 flex justify-center">
        <div className="relative inline-block">
          <Button
            variant="outline"
            className="rounded-full px-4 sm:px-6 py-1 sm:py-1.5 bg-[#7067DC] hover:bg-[#7067DC] text-white border-none text-xs shadow-sm w-[100px] h-[20px]"
            onClick={toggleKeywords}
          >
            Mark Keywords
          </Button>
          {markedKeywords && (
            <div
              className="absolute top-[3px] inset-0 rounded-full pointer-events-none w-[100px] h-[20px]"
              style={{
                boxShadow: "0 0 0 2px white, 0 0 0 3px #7067DC",
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}
