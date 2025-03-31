import "./App.css";
import { Button } from "./components/Button";
import { CreateContextModal } from "./components/CreateContextModal";
import { Card } from "./components/ui/Card";
import { AddIcon } from "./icons/AddIcon";
import { ShareIcon } from "./icons/ShareIcon";

function App() {
  return (
    <>
      {/* <CreateContextModal/> */}
      <div className="p-4">
        
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            text="Share Brain"
            startIcon={<ShareIcon />}
          />
          <Button
            variant="primary"
            text="Add Content"
            startIcon={<AddIcon />}
          />
        </div>
        <div className="flex gap-4">
          <Card
            title="youtube video in my mind"
            type="youtube"
            link="https://www.youtube.com/watch?v=vMtg9hbtvqM&ab_channel=1.1Mviews%E2%80%A210daysago"
          />
          <Card
            title="twitter post"
            type="twitter"
            link="https://x.com/Amank1412/status/1906017343366730208"
          />
        </div>
      </div>
    </>
  );
}

export default App;
