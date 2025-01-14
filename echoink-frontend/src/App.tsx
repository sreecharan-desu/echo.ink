import { BrowserRouter, Route, Routes } from "react-router-dom";import * as React from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the CSS
const LoadingAnimation = React.lazy(()=>import('./components/loadingcomponent'))
const Layout = React.lazy(()=>import('./components/layout'))
const SinglePostView = React.lazy(()=>import('./pages/SinglePostView'))
const AuthorView = React.lazy(()=>import('./pages/AuthorView'))
const Homepage = React.lazy(()=>import('./pages/Home'))
const Signin = React.lazy(()=>import('./pages/signin'))
const Signup = React.lazy(()=>import('./pages/signup'))
const Profile = React.lazy(()=>import('./pages/Profile'))
const Write = React.lazy(()=>import('./pages/Write'))
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
          <Route path="/signin" element={<React.Suspense fallback={<LoadingAnimation/>}><Signin /></React.Suspense>} />
          <Route path="/signup" element={<React.Suspense fallback={<LoadingAnimation/>}><Signup /></React.Suspense>} />
          <Route path="/profile" element={<React.Suspense fallback={<LoadingAnimation/>}><Profile /></React.Suspense>} />
          <Route path="/write" element={<React.Suspense fallback={<LoadingAnimation/>}><Write /></React.Suspense>} />
        </Routes>
    </Layout>
    </BrowserRouter>
  );
}



export default App;
