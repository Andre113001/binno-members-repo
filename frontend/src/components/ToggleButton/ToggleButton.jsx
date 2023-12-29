import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Link } from 'react-router-dom'

export default function StyledToggleButton(props) {
    
    const { currentPage } = props;
    
    const [alignment, setAlignment] = React.useState(currentPage ? currentPage : 'Company');
  
    const handleChange = (event, newAlignment) => {
      console.log(newAlignment);
        setAlignment(newAlignment);
    };
    
    return (
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >

        {/* wag na po galawin */}
        <ToggleButton value={'Company'}><Link to={{ pathname: "/registration/company", state: { page: '0' } }} style={{ textDecoration: 'none', color: 'black' }}>Start-up Company</Link></ToggleButton>
        <ToggleButton value={'Enabler'}><Link to={{ pathname: "/registration/enabler", state: { page: '1' } }} style={{ textDecoration: 'none', color: 'black' }}>Start-up Enabler</Link></ToggleButton>
      </ToggleButtonGroup>
    );
  }