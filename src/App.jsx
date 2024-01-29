/* eslint-disable react/jsx-no-target-blank */
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListData from './components/listData';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DetailData from './components/DetailData';
import Login from './components/Login';

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={(
          <>
            <Login/>
          </>
        )} />
        <Route path="/data" element={(
          <>
            <Navbar/>
            <ListData/>
            <Footer/>
          </>
        )} />
        <Route path="/data/:id" element={(
          <>
            <Navbar/>
            <DetailData/>
            <Footer/>
          </>
        )} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
