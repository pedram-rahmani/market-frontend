import { useMemo } from "react";
import { toJalaali } from "jalaali-js";

const jalaaliMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const jalaaliDays = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'
];

const useDate = (date: string | Date | null | undefined, format: "long" | "short" = "long") => {
  return useMemo(() => {
    if (!date) return "";
    
    const gregorianDate = new Date(date);
    if (isNaN(gregorianDate.getTime())) return "";

    const gy = gregorianDate.getFullYear();
    const gm = gregorianDate.getMonth() + 1;
    const gd = gregorianDate.getDate();

    const jalaaliDate = toJalaali(gy, gm, gd);
    const dayOfWeek = gregorianDate.getDay();
  
    const dayOfWeekInJalaali = jalaaliDays[(dayOfWeek + 1) % 7];

    if (format === "long") {
      return `${dayOfWeekInJalaali} ${jalaaliDate.jd} ${
        jalaaliMonths[jalaaliDate.jm - 1]
      } ${jalaaliDate.jy}`;
    }

    if (format === "short") {
      return `${jalaaliDate.jy}/${String(jalaaliDate.jm).padStart(
        2,
        "0"
      )}/${String(jalaaliDate.jd).padStart(2, "0")}`;
    }

    return "";
  }, [date, format]);
};

export default useDate;