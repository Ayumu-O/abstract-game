import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { boardStateAtom, openSidebarAtom, serialAtom } from "../store";

function Sidebar() {
  const state = useAtomValue(boardStateAtom);
  const [serial, setSerial] = useAtom(serialAtom);
  const [open, setOpen] = useAtom(openSidebarAtom);
  const [copySuccess, setCopySuccess] = useState<boolean | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  const handleClick = () => {
    return async () => {
      try {
        await navigator.clipboard.writeText(state.serialize());
        setCopySuccess(true);
      } catch (e) {
        console.error(e);
        setCopySuccess(false);
      }
    };
  };

  const tooltipColor =
    copySuccess === null
      ? ""
      : copySuccess
      ? "tooltip-success"
      : "tooltip-error";
  const tooltipText =
    copySuccess === null
      ? "クリップボードにコピー"
      : copySuccess
      ? "コピーしました"
      : "コピーに失敗しました";

  return (
    <>
      {open ? (
        <button
          className="flex text-4xl text-white items-center cursor-pointer fixed right-10 top-6 z-50"
          onClick={() => setOpen(!open)}
        >
          x
        </button>
      ) : (
        <svg
          onClick={() => setOpen(!open)}
          className="fixed z-30 flex items-center cursor-pointer right-10 top-6"
          fill="#4a5565"
          viewBox="0 0 100 80"
          width="40"
          height="40"
        >
          <rect width="100" height="10"></rect>
          <rect y="30" width="100" height="10"></rect>
          <rect y="60" width="100" height="10"></rect>
        </svg>
      )}

      <div
        ref={sidebarRef}
        className={`top-0 right-0 w-[35vw] bg-gray-600  p-10 pl-20 text-white fixed h-full z-40  ease-in-out duration-300 ${
          open ? "translate-x-0 " : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between pt-20">
          <h3 className="text-3xl font-semibold text-white">シリアル</h3>
          <div className={`tooltip ${tooltipColor}`} data-tip={tooltipText}>
            <button
              className="btn "
              onClick={handleClick()}
              onMouseLeave={() =>
                setTimeout(() => {
                  setCopySuccess(null);
                }, 200)
              }
            >
              コピー
            </button>
          </div>
        </div>
        <p className="mt-4 text-white break-words bg-gray-500 rounded p-2">
          {state.serialize()}
        </p>

        <h3 className="mt-20 text-3xl font-semibold text-white">
          シリアルから復元
        </h3>
        <textarea
          className="mt-4 p-2 w-full rounded h-56 textarea textarea-accent"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
        />
      </div>
    </>
  );
}

export default Sidebar;
