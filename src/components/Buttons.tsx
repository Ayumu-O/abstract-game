import NewGameButton from "./NewGameButton";
import RedoButton from "./RedoButton";
import UndoButton from "./UndoButton";

function Buttons() {
  return (
    <div className="flex my-10">
      <NewGameButton />
      <UndoButton />
      <RedoButton />
    </div>
  );
}

export default Buttons;
