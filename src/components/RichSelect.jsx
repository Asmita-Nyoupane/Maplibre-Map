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

const RecursiveOptions = ({ options, onOptionSelect, className }) => {
  return (
    <div className={cn(className)}>
      {options.map((option, index) => {
        if (option.options) {
          return (
            <CommandGroup className="pl-4 mt-2" key={index}>
              <div className="cursor-default font-bold text-sm text-gray-800">
                {option.label}
              </div>
              <RecursiveOptions
                options={option.options}
                onOptionSelect={onOptionSelect}
              />
            </CommandGroup>
          );
        } else {
          return (
            <CommandItem
              key={index}
              className={cn(
                "px-4 cursor-pointer hover:bg-gray-100 font-light border-b border-gray-100"
              )}
              onSelect={() => {
                onOptionSelect(option);
              }}
            >
              {option.label}
            </CommandItem>
          );
        }
      })}
    </div>
  );
};

const RichSelect = ({
  options,
  selected,
  onSelect,
  trigger,
  children,
  className,
}) => {
  const [openMain, setOpenMain] = useState(false);

  // console.log('Selected:', selected);

  const handleOptionSelect = (option) => {
    setOpenMain(false);
    onSelect(option);
    console.log("Option selected:", option);
  };

  const handleFlatOptions = (options) => {
    return (
      <CommandGroup>
        {options.map((option, index) => (
          <CommandItem
            key={index}
            className={cn(
              "px-4 cursor-pointer hover:bg-gray-100 font-light border-b border-gray-100"
            )}
            onSelect={() => handleOptionSelect(option)}
          >
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
    );
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
              {options.some((option) => option.options) ? (
                <RecursiveOptions
                  options={options}
                  onOptionSelect={handleOptionSelect}
                />
              ) : (
                handleFlatOptions(options)
              )}
            </CommandList>
          </CommandLibrary>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RichSelect;
