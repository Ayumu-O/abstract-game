import NewGameButton from "./NewGameButton";
import RedoButton from "./RedoButton";
import UndoButton from "./UndoButton";

function Buttons() {
  return (
    <div className="flex justify-between gap-[2vw] w-full">
      <NewGameButton />
      <UndoButton />
      <RedoButton />
    </div>
  );
}

export default Buttons;
