"use client"

import { IconPlus, IconSearch } from "@tabler/icons-react"
import { Button } from "../button"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  Command,
  CommandItem,
} from "../command"
import { useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../dialog"

export const PerformanceHolder = ({
  maxPerformances = 9,
}: {
  maxPerformances?: number
}) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)

  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {Array.from({ length: maxPerformances }).map((_, index) => (
        <Button
          onClick={() => setSelectedSlot(index)}
          className={"h-48 w-full flex-col border-dashed border-foreground"}
          key={index}
        >
          <IconPlus />
          {index + 1}
        </Button>
      ))}
      <Dialog
        open={selectedSlot !== null}
        onOpenChange={(o) => setSelectedSlot(null)}
      >
        <DialogContent className={"min-h-150 min-w-150 pt-8"}>
          <div className="flex flex-col gap-2 mt-2">
            <InputGroup className="w-full">
              <InputGroupInput
                className="w-full"
                placeholder="Search a player..."
              />
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>
            <InputGroup className="w-full">
              <InputGroupInput
                className="w-full"
                placeholder="Search the vs opponent..."
              />
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
