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
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path='/popular' element={<Popular />} />
                  <Route path='/reels' element={<Reels />} />
                  <Route path='/following' element={<Following />} />
                  <Route path='/profile/:userId' element={<Profile />} />
                </Route>
                <Route path='*' element={<Navigate to="/404" />} />
                <Route path='/login' element={<Login />} />
                <Route path='/404' element={<Error404NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
      <CustomToaster theme={theme} />
    </>
  )
}

export default App
