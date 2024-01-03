import React from 'react';
import WebRoundedIcon from '@mui/icons-material/WebRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';


const SideBarData_Company = [   
    {
        title: "Account",
        icon:  <PersonRoundedIcon />,
        link:   "/account"
    },
    {
        title: "Posts",
        icon:  <NewspaperRoundedIcon />,
        link:   "/posts"
    },
    {
        title: "Events",
        icon:  <CalendarMonthRoundedIcon />,
        link:   "/events"
    },

];

export default SideBarData_Company;
