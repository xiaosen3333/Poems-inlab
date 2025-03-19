"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update the selected color when the prop changes
  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  // Common colors for quick selection
  const commonColors = [
    "#f44336", // Red
    "#e91e63", // Pink
    "#9c27b0", // Purple
    "#673ab7", // Deep Purple
    "#3f51b5", // Indigo
    "#2196f3", // Blue
    "#03a9f4", // Light Blue
    "#00bcd4", // Cyan
    "#009688", // Teal
    "#4caf50", // Green
    "#8bc34a", // Light Green
    "#cddc39", // Lime
    "#ffeb3b", // Yellow
    "#ffc107", // Amber
    "#ff9800", // Orange
    "#ff5722", // Deep Orange
    "#795548", // Brown
    "#9e9e9e", // Grey
    "#607d8b", // Blue Grey
    "#ffffff", // White
    "#000000", // Black
  ];

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    onChange(newColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-10 h-10 p-0 border-2"
          style={{ backgroundColor: selectedColor }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="mb-3">
          <div className="flex mb-2">
            <div
              className="w-full h-10 rounded"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="ml-2 h-8 w-8 cursor-pointer"
            />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {commonColors.map((color, index) => (
            <button
              key={index}
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: color }}
              onClick={() => {
                handleColorChange(color);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}