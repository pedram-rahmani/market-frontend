import { useEffect, useRef, RefObject } from "react";

const useClickOutside = (
  onClickOutside: () => void,
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[]
) => {
  const callbackRef = useRef(onClickOutside);
  const refsRef = useRef(refs);

  useEffect(() => {
    callbackRef.current = onClickOutside;
    refsRef.current = refs;
  }, [onClickOutside, refs]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const refArray = Array.isArray(refsRef.current)
        ? refsRef.current
        : [refsRef.current];

      const isInside = refArray.some(
        (ref) => ref.current && ref.current.contains(e.target as Node),
      );

      if (!isInside) callbackRef.current();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
};

export default useClickOutside;