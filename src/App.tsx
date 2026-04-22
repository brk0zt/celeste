import { Routes, Route } from 'react-router';
import { lazy, Suspense } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const Discover = lazy(() => import('./pages/Discover'));
const BlogReader = lazy(() => import('./pages/BlogReader'));
const Profile = lazy(() => import('./pages/Profile'));

function PageLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#05050f]">
      <div className="text-[#555] text-sm">加载中...</div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/discover" element={
        <Suspense fallback={<PageLoader />}>
          <Discover />
        </Suspense>
      } />
      <Route path="/blog/:id" element={
        <Suspense fallback={<PageLoader />}>
          <BlogReader />
        </Suspense>
      } />
      <Route path="/profile" element={
        <Suspense fallback={<PageLoader />}>
          <Profile />
        </Suspense>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
