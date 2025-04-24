import { useEffect } from "react";

export default function useModalScrollLock(isAnyModalOpen) {
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAnyModalOpen]);
}
