import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import MyListTable from './components/Mylist/Mylist';
import Movie from './components/Movie/Movie';
import { RightSideBar } from './components/RightSideBar/RightSideBar';
import Users from './components/Users/Users';
import Container from './components/Container/Container';
import BasicTabs from './components/Tabs/Tabs';
import TempContainer from './components/Container/TempContainer';
import Chat from './components/Chat/Chat';
import ChatContainer from './components/Container/ChatContainer';

 
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

  <BrowserRouter>
  <BasicTabs/>
  <Routes>
  
    <Route path="/users" element={<Users />} />
        <Route path="/home" element={<Container />} />
        <Route path="/movies/:id" element={<TempContainer />} />
        <Route path="/movies" element={<TempContainer />} />
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<Movie/>} />
        <Route path="/list" element={<MyListTable/>} />
        <Route path="/chat/:id?" element={<ChatContainer/>} />
       
      </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
