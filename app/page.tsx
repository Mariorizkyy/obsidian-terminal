import BloombergTerminal from "@/components/bloomberg/layout/bloomberg-terminal";
import { Provider } from "jotai";

export default function Home() {
  return (
    <Provider>
      <BloombergTerminal />
    </Provider>
  );
}
