import React, { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format, isValid } from "date-fns";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/react";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";

type DatePickerProps = {
  onSelect: (date: Date) => void;
  initialDate?: Date | null;
};

const DatePicker: React.FC<DatePickerProps> = ({ onSelect, initialDate }) => {
  const [date, setDate] = useState<Date | undefined>(() => {
    if (initialDate && isValid(initialDate)) {
      return initialDate;
    }
    return undefined;
  });

  useEffect(() => {
    if (initialDate && isValid(initialDate)) {
      setDate(initialDate);
    }
  }, [initialDate]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate && isValid(newDate)) {
      setDate(newDate);
      onSelect(newDate);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (date && isValid(date)) {
      try {
        return format(date, "PPP");
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
      }
    }
    return "Pick a date";
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
          <span>{formatDate(date)}</span>
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