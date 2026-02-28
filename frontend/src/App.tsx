import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { UploadPage } from './pages/UploadPage';
import { ReelDetailPage } from './pages/ReelDetailPage';
import { Toaster } from '@/components/ui/sonner';

// Layout component
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster theme="dark" />
    </div>
  );
}

// Routes
const rootRoute = createRootRoute({
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/browse',
  component: BrowsePage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: UploadPage,
});

const reelDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reel/$id',
  component: ReelDetailPage,
});

const routeTree = rootRoute.addChildren([homeRoute, browseRoute, uploadRoute, reelDetailRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
