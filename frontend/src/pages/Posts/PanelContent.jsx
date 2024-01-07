import React from 'react'
import styles from './PanelContent.module.css'
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

function PanelContent(props) {
    const {filteredPosts}=props

  return (
    <>
        {filteredPosts?.map((post) => {

            return (
            <div className={styles['PostContent']}>
                <Link to={'#'} style={{textDecoration: 'none', color: 'inherit'}}>
                <div className={styles['PostCards']}>
                    <div className={styles['titleImageContainer']}>
                        <img src={post.postImage} alt="" />
                    </div>
                        
                    <div className={styles['contentDetail']}>
                        <div className={styles['ShareCategoryContainer']}>
                            <div className={styles['ChipsContiner']}>
                            <Stack direction="row" >
                                <Chip
                                    label={post.category}
                                    sx={{
                                        backgroundColor: post.category === 'Milestone' ? '#fd7c06' : '#054eae',
                                        color: '#fff',
                                        padding: '5px',
                                    }}
                                />
                            </Stack>
                            </div>
                            <Stack direction="row" alignItems="center">
                                <IconButton size="medium">
                                    <ShareIcon/>
                                </IconButton>
                            </Stack>
                        </div>
                        <div className={styles['contentHeading']}>
                            <div className={styles['titleContainer']}>
                                <h2>{post.title}</h2>
                            </div>
                            <p>{post.date}</p>
                        </div>
                    <p>{post.description}</p>
                        <div className={styles['contentFooter']}>
                                <div className={styles["PostUserProfile"]}>
                                    <img src={post.profileImage} alt="User Profile"/>
                                    <h2>{post.user}</h2>
                                </div>
                            <div >
                                <p>Click to View and Edit</p>
                            </div>
                        </div>

                    </div>
                </div>
                </Link>
            </div>
            )
        })}
    </>
  )
}

export default PanelContent