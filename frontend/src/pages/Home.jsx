import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';

// Components //
import Button from '../components/Button/Button';
import Sidebar from '../components/Sidebar/Sidebar';

function Home() {
  return (
    <>
      <div className="page-container">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className='flex-1 p-4'>
          <h1 className='heading-1'>Home Page</h1>
          <Link to={"members"}>
            <Button color="btn-orange" text="Click Me" />
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
