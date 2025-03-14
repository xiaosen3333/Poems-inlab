import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="p-4">
        <div className="text-purple-600 text-xl font-medium">
          PoemStudio{" "}
          <span className="hidden sm:inline text-sm text-purple-400">- A creative studio for cross-cultural poetry learning</span>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-purple-500 mb-4 sm:mb-6">PoemStudio</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-purple-400 mb-8 sm:mb-12">Embark on a poetic odyssey across cultures!</p>

        <Link
          href="/poetry"
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-lg sm:text-xl transition-colors flex items-center"
        >
          START <span className="ml-2">➔</span>
        </Link>
      </main>
    </div>
  )
}

