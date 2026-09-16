import { useEffect, useCallback, RefObject } from "react";

const useClickOutside = (
  onClickOutside: () => void,
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[]
) => {
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const refArray = Array.isArray(refs) ? refs : [refs];
      
      const isInside = refArray.some(
        (ref) => ref.current && ref.current.contains(e.target as Node)
      );

      if (!isInside) {
        onClickOutside();
      }
    },
    [onClickOutside, refs]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
};

export default useClickOutside;