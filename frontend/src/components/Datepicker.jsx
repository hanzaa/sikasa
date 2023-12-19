import React, { useRef } from "react";
import Flatpickr from "react-flatpickr";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton } from "@mui/material";

function Datepicker({ onChange, minDate, maxDate }) {
   const fp = useRef(null);
   const options = {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M j, Y",
      defaultDate: [],
      prevArrow:
         '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
         '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onReady: (selectedDates, dateStr, instance) => {
         instance.element.value = dateStr.replace("to", "-");
      },
      onChange: (selectedDates, dateStr, instance) => {
         if (selectedDates.length === 0) {
            onChange([]); // Send an empty array if no dates are selected
         } else {
            const formattedDates = dateStr
               .split(" to ") // Split the dateStr into two parts
               .map((date) => {
                  const [month, day, year] = date.split(" "); // Split each date part
                  const [customDay] = day.split(","); // remove "," from day
                  const monthNumber =
                     new Date(Date.parse(`${month} 1, ${year}`)).getMonth() + 1; // Get the month number
                  return `${year}-${monthNumber
                     .toString()
                     .padStart(2, "0")}-${customDay.padStart(2, "0")}`; // Format as "YYYY-MM-DD"
               });
            console.log("in Datepicker", formattedDates);
            onChange(formattedDates); // Call the onChange prop with the formatted dates
         }
         instance.element.value = dateStr.replace("to", "-");
      },
   };

   return (
      <div className="relative">
         <Flatpickr
            className="form-input pl-9 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200 font-medium w-[15.5rem]"
            options={options}
            ref={fp}
         />
         <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
            <svg
               className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 ml-3"
               viewBox="0 0 16 16"
            >
               <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
            </svg>
         </div>
         <IconButton
            onClick={() => {
               if (!fp?.current?.flatpickr) return;
               fp.current.flatpickr.clear();
            }}
         >
            <RefreshIcon fontSize="small" />
         </IconButton>
      </div>
   );
}

export default Datepicker;
