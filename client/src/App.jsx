import { BrowserRouter, Routes, Route } from "react-router-dom";
import Events from "./pages/Events";
import EventDetails from "./pages/EventsDetail";
import WebSocketComponent from "./WebSocketComponent";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
