import { Home } from "./views/Home";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root-home");
const root = createRoot(container!);
root.render(<Home />);
