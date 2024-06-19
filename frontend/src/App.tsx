import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const doClick = () => {
    console.log("hello");
  };
  return (
    <>
      <Button className={"active:bg-slate-500"} onClick={doClick}>
        Hello Shadcn
      </Button>
    </>
  );
}

export default App;
