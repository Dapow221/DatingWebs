import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/react";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";

type DatePickerProps = {
    onSelect: (date: Date) => void;
  };

const DatePicker: React.FC<DatePickerProps> = ({ onSelect }) => {
  const [date, setDate] = useState<Date>();

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      onSelect(date);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          width="240px"
          justifyContent="start"
          textAlign="left"
          fontWeight="normal"
          className={cn(
            !date && "text-muted-foreground"
          )}
          leftIcon={<CalendarIcon className="mr-2 h-4 w-4" />}
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent width="auto" padding={0}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
