import React, { useState } from "react";

export default function useSelect(isOpen: boolean, dataArr: string[]) {
  const [openSelect, setOpenselect] = useState(isOpen);
  const [selectedOption, setSelectedOption] = useState("انتخاب کنید");

  const selectBoxActive = {
    selectBox: openSelect ? "select-box-v-container-o" : "",
    selectBoxArrow: openSelect ? "select-box-v-arrow-u" : "",
    selectBoxDropDown: openSelect ? "drop-down-active" : "",
  };

  const openSelectBox = () => setOpenselect((prev) => !prev);

  const changeOption = (e: React.MouseEvent<HTMLLIElement>) => {
    setSelectedOption(e.currentTarget.innerText);
    setOpenselect(false);
  };

  const selectBoxItem = (
    <ul
      className={`drop-down ${openSelect ? "drop-down-active h-[8.3rem]" : ""}`}
      role="listbox"
      aria-expanded={openSelect}
    >
      {dataArr.map((data) => (
        <li
          key={data}
          onClick={changeOption}
          className={`drop-down-item ${
            selectedOption === data ? "drop-down-item-selected" : ""
          }`}
          role="option"
        >
          {data}
          {selectedOption === data && (
            <svg viewBox="0 0 24 24" className="size-2.5">
              <path d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
        </li>
      ))}
    </ul>
  );

  return [openSelectBox, selectBoxActive, selectBoxItem, selectedOption] as const;
}