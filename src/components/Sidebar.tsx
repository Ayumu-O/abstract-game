import { useAtom, useAtomValue } from "jotai";
import { boardStateAtom, openSidebarAtom, serialAtom } from "../store";

function Sidebar() {
  const state = useAtomValue(boardStateAtom);
  const [serial, setSerial] = useAtom(serialAtom);
  const [open, setOpen] = useAtom(openSidebarAtom);

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
        className={`top-0 right-0 w-[35vw] bg-gray-600  p-10 pl-20 text-white fixed h-full z-40  ease-in-out duration-300 ${
          open ? "translate-x-0 " : "translate-x-full"
        }`}
      >
        <h3 className="mt-20 text-3xl font-semibold text-white">シリアル</h3>
        <p className="mt-4 text-white  break-words">{state.serialize()}</p>

        <h3 className="mt-20 text-3xl font-semibold text-white">
          シリアルから復元
        </h3>
        <textarea
          className="mt-4 p-2 w-full rounded h-56"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
        />
      </div>
    </>
  );
}

export default Sidebar;
