"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function Header() {
  return (
    <header className="p-4 sm:p-5 flex justify-between items-center">
      <div className="text-[#7067DC] text-xl font-medium">
        <Link href="/">
          PoemStudio{" "}
          <span className="hidden sm:inline text-sm font-normal text-[#7067DC]">
            - A creative studio for cross-cultural poetry learning
          </span>
        </Link>
      </div>
      <div>
        <Link href="/config">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Settings size={16} />
            <span className="hidden sm:inline">Configuration</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
