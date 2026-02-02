
import { BrowserRouter, Route, Routes } from 'react-router'
import { Home } from './pages/Home'
import Login from './pages/Login'
import { Register } from './pages/Register'
import { Forgot } from './pages/Forgot'
import { Confirm } from './pages/Confirm'
import { NotFound } from './pages/NotFound'
import Dashboard from './layout/Dashboard'
import Profile from './pages/Profile'
import List from './pages/List'
import Details from './pages/Details'
import Create from './pages/Create'
import Update from './pages/Update'
import Chat from './pages/Chat'
import FacerRecognition from './pages/FaceRecognition'

import Reset from './pages/Reset'
import Panel from './pages/Panel'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'

import { useEffect } from 'react'
import storeProfile from './context/storeProfile'
import storeAuth from './context/storeAuth'

import GoogleCallback from './pages/GoogleCallback';

import DonacionPage from './pages/DonacionPage';
import DonacionesAdmin from './pages/DonacionesAdmin';

import ExplorarProyectos from './pages/ExplorarProyectos';
import CrearProyecto from './pages/CrearProyecto';
import ListarProyecto from './pages/ListarProyecto.jsx';
import DetalleProyecto from './pages/DetalleProyecto';

import EditarProyecto from './pages/EditarProyecto';

import AdminUsuarios from './pages/AdminUsuarios';
import AdminPublicaciones from './pages/AdminPublicaciones';
import DetalleUsuario from './pages/DetalleUsuario';


function App() {
  const { profile} = storeProfile()
  const { token } = storeAuth()

  useEffect(() => {
    if(token){
      profile()
    }
  }, [token])
  
  return (
    <>
      <BrowserRouter>
        <Routes>

          
          <Route element={<PublicRoute />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='google-callback' element={<GoogleCallback />} />

            <Route path='register' element={<Register />} />
            <Route path='forgot/:id' element={<Forgot />} />
            <Route path='confirm/:token' element={<Confirm />} />
            <Route path='reset/:token' element={<Reset />} />
            <Route path='*' element={<NotFound />} />
          </Route>


          <Route path='dashboard/*' element={
            <ProtectedRoute>
              <Routes>
                <Route element={<Dashboard />}>
                  <Route index element={<Panel />} />
                  <Route path='profile' element={<Profile />} />
                  <Route path='list' element={<List />} />
                  <Route path='details/:id' element={<Details />} />
                  <Route path='create' element={<Create />} />
                  <Route path='update/:id' element={<Update />} />
                  <Route path='chat' element={<Chat />} />
                  <Route path='facerecognition' element={<FacerRecognition/>} />
                  
                  <Route path='donar' element={<DonacionPage />} />
                  <Route path='donaciones' element={<DonacionesAdmin />} />
                  <Route path='donar' element={<DonacionPage />} />
                  <Route path='explorar' element={<ExplorarProyectos />} />
                  <Route path='crear' element={<CrearProyecto />} />
                  <Route path='listar' element={<ListarProyecto />} />
                  <Route path='proyecto/:id' element={<DetalleProyecto />} />
                  <Route path='actualizar/:id' element={<EditarProyecto />} />

                  <Route path='usuarios' element={<AdminUsuarios />} />
                  <Route path='usuario/:id' element={<DetalleUsuario />} /> 
                  <Route path='publicaciones' element={<AdminPublicaciones />} />
              

                </Route>
              </Routes>
            </ProtectedRoute>
            } />

            

      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
