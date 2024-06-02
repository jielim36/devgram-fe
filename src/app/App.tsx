import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import { ThemeProvider } from '@/utils/ThemeProvider';
import Layout from '@/components/Layout/Layout';

function App() {

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
