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

const Layout = React.lazy(() => import('@/components/Layout/Layout'));
const Home = React.lazy(() => import('../pages/Home/Home'));
const Popular = React.lazy(() => import('@/pages/Popular/Popular'));
const Reels = React.lazy(() => import('@/pages/Reels/Reels'));
const Following = React.lazy(() => import('@/pages/Following/Following'));
const Profile = React.lazy(() => import('@/pages/Profile/Profile'));
const Login = React.lazy(() => import('../pages/Login/Login'));
const Error404NotFound = React.lazy(() => import('@/pages/InvalidPages/Error404NotFound'));
import CustomToaster from '@/components/Toast/CustomToast';
import { routes } from './Routes';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function App() {

  const { theme } = useTheme();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path={routes.home} element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path={routes.popular} element={<Popular />} />
                  <Route path={routes.reels} element={<Reels />} />
                  <Route path={routes.following} element={<Following />} />
                  <Route path={routes.profile} element={<Profile />} />
                </Route>
                <Route path="*" element={<Navigate to={routes.notFound} />} />
                <Route path={routes.login} element={<Login />} />
                <Route path={routes.notFound} element={<Error404NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
      <CustomToaster theme={theme} />
    </>
  );
}

export default App
