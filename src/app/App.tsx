import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import { ThemeProvider } from '@/utils/ThemeProvider';
import Layout from '@/components/Layout/Layout';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Popular from '@/pages/Popular/Popular';
import Reels from '@/pages/Reels/Reels';
import Following from '@/pages/Following/Following';
import Profile from '@/pages/Profile/Profile';
import { AuthProvider } from '@/utils/AuthProvider';

function App() {

  const queryClient = new QueryClient()

  return (

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
                <Route path='/profile' element={<Profile />} />
              </Route>
              <Route path='/login' element={<Login />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
