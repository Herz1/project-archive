import { Landing } from "./Landing";
import { projectRoster } from "./projectRoster";
export default function Home() {
  return <Landing isSignedIn={false} characters={projectRoster} signInOptions={null} assets={{ memory_still_url: null }} />;
}
