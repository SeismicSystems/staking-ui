import "./App.css";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ConnectButton } from "@rainbow-me/rainbowkit";
function App() {
  return (
    <div>
      <ConnectButton />
      <LoadingSpinner size={200} />
    </div>
  );
}

export default App;
