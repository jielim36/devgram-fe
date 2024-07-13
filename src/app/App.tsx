import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ThemeProvider, useTheme } from '@/utils/ThemeProvider';
import { AuthProvider } from '@/utils/AuthProvider';
// import Home from '../pages/Home/Home';
// import Login from '../pages/Login/Login';
// import Layout from '@/components/Layout/Layout';
// import Popular from '@/pages/Popular/Popular';
// import Reels from '@/pages/Reels/Reels';
// import Following from '@/pages/Following/Following';
// import Profile from '@/pages/Profile/Profile';
// import Error404NotFound from '@/pages/InvalidPages/Error404NotFound';
// import Chat from '@/pages/chat/Chat';

const Layout = React.lazy(() => import('@/components/Layout/Layout'));
const Home = React.lazy(() => import('../pages/Home/Home'));
const Reels = React.lazy(() => import('@/pages/Reels/Reels'));
const Following = React.lazy(() => import('@/pages/Following/Following'));
const Chat = React.lazy(() => import('@/pages/chat/Chat'));
const Profile = React.lazy(() => import('@/pages/Profile/Profile'));
const Login = React.lazy(() => import('../pages/Login/Login'));
const Error404NotFound = React.lazy(() => import('@/pages/InvalidPages/Error404NotFound'));
import CustomToaster from '@/components/Toast/CustomToast';
import { routes } from './Routes';
import Icon from '@/components/Icon/Icon';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const Spinner = () => (
  <div className="h-screen w-screen flex justify-center items-center">
    <Icon name="loader-circle" className="animate-spin text-muted-foreground h-12 w-12" />
  </div>
);

function App() {

  const { theme } = useTheme();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <BrowserRouter>
            <AuthProvider>
              <React.Suspense fallback={<Spinner />}>
                <Routes>
                  <Route path={routes.home} element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path={routes.reels} element={<Reels />} />
                    <Route path={routes.following} element={<Following />} />
                    <Route path={routes.profile} element={<Profile />} />
                  </Route>
                  <Route path={routes.chat} element={<Chat />} />
                  <Route path={routes.chatWithoutUserId} element={<Chat />} />
                  <Route path="*" element={<Navigate to={routes.notFound} />} />
                  <Route path={routes.login} element={<Login />} />
                  <Route path={routes.notFound} element={<Error404NotFound />} />
                </Routes>
              </React.Suspense>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
      <CustomToaster theme={theme} />
    </>
  );
}

export default App
