import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Room from "./Pages/Room.jsx"
import  Home  from "./Pages/Home.jsx"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
         <Route path='/room/:roomId' element={<Room/>}/>
      </Routes>
    </div>
  )
}

export default App