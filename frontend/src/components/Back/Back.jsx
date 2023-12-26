import React from 'react'
import { Link } from 'react-router-dom'
import {ArrowBack as ArrowBackIcon} from '@mui/icons-material'
import './Back.css';

function Back(props) {
    return (
        <div>
            <div className="flex space-x-4 mb-5 mt-10">
                <Link to={props.link}>
                    <div className="icon cursor-pointer flex row-auto justify-center items-center" >
                        <ArrowBackIcon />
                        <span>Back</span>
                    </div>
                </Link>
            </div>
        </div>
  )
}

export default Back
