"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Category } from "@/types/category"; 
import MenuItem from "./MenuItem";

interface MegaMenuProps {
  showMenu: boolean;
  menuItems: Category[];
  onClose: () => void;
}

interface SelectedState {
  parentId: number | null;
  parentId2: number | null;
  parentId3: number | null;
}

export default function MegaMenu({
  showMenu,
  menuItems,
  onClose,
}: MegaMenuProps) {
  const [selected, setSelected] = useState<SelectedState>({
    parentId: null,
    parentId2: null,
    parentId3: null,
  });

  useEffect(() => {
    if (!showMenu) {
      setSelected({ parentId: null, parentId2: null, parentId3: null });
    }
  }, [showMenu]);

  const maxLevel = useMemo(() => {
    if (menuItems.length === 0) return 1;
    return Math.max(...menuItems.map((item) => item.level));
  }, [menuItems]);

  const catOne = useMemo(() => 
    menuItems.filter((i) => i.level === 1 || i.parent_id === null), 
    [menuItems]
  );
  
  const catTwo = useMemo(
    () => menuItems.filter((item) => 
      item.level === 2 && item.parent_id === selected.parentId
    ),
    [menuItems, selected.parentId]
  );

  const catThree = useMemo(
    () => menuItems.filter((item) => item.level === 3 && item.parent_id === selected.parentId2),
    [menuItems, selected.parentId2]
  );

  const handleSelectParent = useCallback((id: number) => {
    setSelected((prev) => ({
      parentId: prev.parentId === id ? id : id,
      parentId2: null,
      parentId3: null,
    }));
  }, []);

  const handleSelectChild = useCallback((id: number) => {
    setSelected((prev) => ({ ...prev, parentId2: id, parentId3: null }));
  }, []);

  const handleSelectLevel3 = useCallback((id: number) => {
    setSelected((prev) => ({ ...prev, parentId3: id }));
  }, []);

  const renderMenuItems = (
    items: Category[],
    level: number,
    selectHandler: (id: number) => void,
  ) =>
    items.map((item) => {
      const isActive = 
        level === 1 ? item.id === selected.parentId :
        level === 2 ? item.id === selected.parentId2 :
        item.id === selected.parentId3;

      return (
        <MenuItem
          key={item.id}
          item={item}
          onHover={() => selectHandler(item.id)}
          onClick={() => selectHandler(item.id)}
          isActive={isActive}
          isLastLevel={level === maxLevel}
          menuItems={menuItems}
          maxLevel={maxLevel}
          onCloseMenu={onClose}
        />
      );
    });

  if (menuItems.length === 0) return null;

  return (
    <div
      className={`relative flex transition-[height] z-40 py-1 duration-300 ease-in-out rounded-br-sm bg-white dark:bg-dark-600 shadow
        ${!showMenu ? "h-0" : "h-96"}`}
    >
      {/* Level 1 */}
      <ul className="flex flex-col h-full w-64 px-1 ml-0.5 overflow-y-auto scrollbar space-y-1 rounded-br-lg">
        {renderMenuItems(catOne, 1, handleSelectParent)}
      </ul>

      {/* Level 2 & 3 */}
      <div className="absolute flex right-full h-full w-full top-0 bg-inherit rounded-bl-sm space-x-0.5">
        {catTwo.length > 0 && (
          <div className="w-64 py-1 flex">
            <ul className="flex flex-col h-full w-64 px-1 ml-0.5 overflow-y-auto scrollbar space-y-1">
              {renderMenuItems(catTwo, 2, handleSelectChild)}
            </ul>
          </div>
        )}
        {catThree.length > 0 && (
          <div className="w-64 py-1 bg-inherit">
            <ul className="flex flex-col h-full w-64 ml-0.5 overflow-y-auto scrollbar space-y-1">
              {renderMenuItems(catThree, 3, handleSelectLevel3)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}