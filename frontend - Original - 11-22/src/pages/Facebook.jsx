import React, {useEffect, useState} from 'react'

// STEP 1
// To authenticate using Facebook, you can use the passport-facebook module with Passport.js. 
// This module provides a simple way to authenticate users using Facebook and obtain an access token that can be used to make API requests. 
// You can find a tutorial on how to use this module with Node.js here1.

// STEP 2
// To upload posts on a Facebook page, you can use the Facebook Graph API. 
// You will need to create a Facebook app and obtain an access token with the manage_pages permission. 
// You can then use this access token to make API requests to the /me/accounts endpoint to obtain a list of pages that you manage. 
// You can then use the page_access_token to make API requests to the /page-id/feed endpoint to create a new post. 
// You can find more information on how to use the Facebook Graph API here 2.

// STEP 3
// To create a web application that uses React, Express, Node.js, and MySQL, you can follow this tutorial here 3. 
// This tutorial covers how to create a simple web application that allows users to create, read, update, 
// and delete records in a PostgreSQL database. You can modify this tutorial to use MySQL instead of PostgreSQL.

// STEP 4
// To upload files to a server using React, you can use the axios module to make HTTP requests to your server. 
// You can find a tutorial on how to upload files to a server using React and Node.js here4.

const Facebook = () => {

        
    return (
        <div>
            <h1>I'm from facebook</h1>
            <button className='btn-blue'>Click Me!</button>
        </div>
    )
}
export default Facebook
