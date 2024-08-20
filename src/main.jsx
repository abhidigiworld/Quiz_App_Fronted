import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import Login from './component/Login.jsx'
import Signup from './component/Signup.jsx'
import AdminPage from './component/AdminPage.jsx'
import SetQuestionPaper from './component/SetQuestionPaper.jsx'
import StudentDashboard from './component/StudentDashboard.jsx'
import TestPage from './component/TestPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup/>
  },
  {
    path: '/admin',
    element: <AdminPage/>
  },
  {
    path: 'setquestion',
    element: <SetQuestionPaper/>
  },{
    path: '/student',
    element: <StudentDashboard/>
  },{
    path: '/test',
    element: <TestPage/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
