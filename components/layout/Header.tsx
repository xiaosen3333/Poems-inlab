"use client"

export function Header() {
  return (
    <header className="p-4 sm:p-5">
      <div className="text-purple-600 text-xl font-medium">
        PoemStudio{" "}
        <span className="hidden sm:inline text-sm font-normal text-purple-400">- A creative studio for cross-cultural poetry learning</span>
      </div>
    </header>
  )
}