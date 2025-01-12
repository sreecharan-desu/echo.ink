import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Home";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the CSS
import { Layout } from "./components/layout";

function App() {
  return (
    <Layout>
      <BrowserRouter>
        {/* ToastContainer should be outside Routes */}
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
