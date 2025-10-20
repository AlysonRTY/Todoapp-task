import { BrowserRouter, Route, Routes } from "react-router";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Tasks />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
