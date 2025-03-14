"use client";

import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../library/popover";
import {
  CommandLibrary,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandInput,
} from "../library/command";
import { cn } from "../library/utilis/utilis";

const RecursiveOptions = ({
  options,
  onOptionSelect,
  selected = [],
  className,
  isSelectable = () => false,
}) => {
  return (
    <div className={cn(className)}>
      {options.map((option, index) => {
        const subOptions = option.options;
        const isOptionSelectable = isSelectable(option);

        if (subOptions?.length > 0) {
          return (
            <CommandGroup className="pl-4 mt-2" key={index}>
              <div className="cursor-default font-bold text-sm text-gray-800">
                {option.label}
              </div>
              <RecursiveOptions
                options={subOptions}
                onOptionSelect={onOptionSelect}
                selected={selected}
                isSelectable={isSelectable}
              />
            </CommandGroup>
          );
        } else if (isOptionSelectable) {
          const isSelected = selected.some(
            (item) => item.value === option.value
          );

          return (
            <CommandItem
              key={index}
              className={cn(
                "px-4 cursor-pointer font-light border-b border-gray-100",
                isSelected ? "bg-blue-50" : "hover:bg-gray-100"
              )}
              onSelect={() => onOptionSelect(option)}
            >
              <div className="flex justify-between items-center w-full">
                <span>{option.label}</span>
                {isSelected && <span className="text-blue-600">✓</span>}
              </div>
            </CommandItem>
          );
        }
        return null;
      })}
    </div>
  );
};

const RichSelect = ({
  options,
  selected = [],
  onSelect,
  trigger,
  children,
  className,
}) => {
  const [openMain, setOpenMain] = useState(false);

  const handleOptionSelect = (option) => {
    const isSelected = selected.some((item) => item.value === option.value);

    const newSelected = isSelected
      ? selected.filter((item) => item.value !== option.value)
      : [...selected, option];

    onSelect(newSelected);
  };

  return (
    <div className={cn("relative flex", className)}>
      <Popover open={openMain} onOpenChange={setOpenMain}>
        <PopoverTrigger asChild>
          {children ? children : trigger(selected)}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          alignOffset={-4}
          sideOffset={8}
          className="bg-white border w-80 max-h-[300px] overflow-auto"
          style={{
            zIndex: 50,
            position: "relative",
          }}
        >
          <CommandLibrary>
            <CommandInput
              placeholder="Search..."
              className="px-4 py-2 mb-2 border-b border-gray-300 sticky top-0 bg-white"
            />
            <CommandList>
              <RecursiveOptions
                options={options}
                onOptionSelect={handleOptionSelect}
                selected={selected}
                isSelectable={(option) => !option.options?.length}
              />
            </CommandList>
          </CommandLibrary>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RichSelect;
