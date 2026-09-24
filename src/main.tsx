import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import Board from '@/board/Board'
import { AppShell } from '@/components/layout/AppShell'
import AboutYou from '@/screens/fr01/AboutYou'
import Catalogue from '@/screens/fr01/Catalogue'
import LevelSelect from '@/screens/fr01/LevelSelect'
import CareerDetail from '@/screens/fr02/CareerDetail'
import Roadmap from '@/screens/fr03/Roadmap'
import StepDetail from '@/screens/fr03/StepDetail'
import Resources from '@/screens/fr04/Resources'
import './styles/index.css'

const router = createBrowserRouter([
  { path: '/board', element: <Board /> },
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Navigate to="/start" replace /> },
      { path: '/start', element: <LevelSelect /> },
      { path: '/start/about', element: <AboutYou /> },
      { path: '/careers', element: <Catalogue /> },
      { path: '/careers/:careerId', element: <CareerDetail /> },
      { path: '/careers/:careerId/roadmap', element: <Roadmap /> },
      { path: '/careers/:careerId/roadmap/:stepId', element: <StepDetail /> },
      { path: '/careers/:careerId/roadmap/:stepId/resources', element: <Resources /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
