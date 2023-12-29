import React from 'react';
import WebRoundedIcon from '@mui/icons-material/WebRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';


export const SideBarData = [
    {
        title: "Dashboard",
        icon:  <WebRoundedIcon />,
        link:   "/  " //will be change to '/dashboard' once login is added
    },
    {
        title: "Guides",
        icon:  <SpaceDashboardRoundedIcon />,
        link:   "/guides"
    }, 
    {
        title: "Events",
        icon:  <CalendarMonthRoundedIcon />,
        link:   "/events"
    },
    {
        title: "Blog Entries",
        icon:  <NewspaperRoundedIcon />,
        link:   "/blogs"
    },
   
    {
        title: "Account",
        icon:  <PersonRoundedIcon />,
        link:   "/account"
    },
]
