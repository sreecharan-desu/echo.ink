import { BrowserRouter, Route, Routes } from "react-router-dom";import * as React from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the CSS
const LoadingAnimation = React.lazy(()=>import('./components/loadingcomponent'))
const Layout = React.lazy(()=>import('./components/layout'))
const SinglePostView = React.lazy(()=>import('./pages/SinglePostView'))
const AuthorView = React.lazy(()=>import('./pages/AuthorView'))
const Homepage = React.lazy(()=>import('./pages/Home'))

function App() {
  return (
    <BrowserRouter>
    <Layout>
        {/* ToastContainer should be outside Routes */}
        <ToastContainer />
        <Routes>
          <Route path="/" element={<React.Suspense fallback={<LoadingAnimation/>}><Homepage /></React.Suspense>} />
          <Route path="/post/:postId" element={<React.Suspense fallback={<LoadingAnimation/>}><SinglePostView /></React.Suspense>} />
          <Route path="/author/:authorId" element={<React.Suspense fallback={<LoadingAnimation/>}><AuthorView /></React.Suspense>} />
        </Routes>
    </Layout>
    </BrowserRouter>
  );
}



export default App;
