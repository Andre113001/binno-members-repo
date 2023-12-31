import React, { useState, useEffect } from 'react';

import SideBar from '../../components/Sidebar/Sidebar';
import Header from '../../components/header/Header';
import Back from '../../components/Back/Back';

import Draggable from '../../components/DND/Draggable';
import Droppable from '../../components/DND/Droppable';

import { Link, useParams } from 'react-router-dom';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
  } from "@dnd-kit/core";
  import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
  } from "@dnd-kit/sortable";
  
  import { Sortable } from "../../components/DND/Sortable";

import './Guides.css';
import { BorderRightOutlined } from '@mui/icons-material';

const GuidePage = () => {
    const [items] = useState([1,2,3]);
    const { pageId } = useParams();
    const [pageContents, setPageContents] = useState();

    useEffect(() =>  {
        try {
            const loadPageData = async () => {
                const response = await fetch(`/api/program/page/${pageId}`)
                response.json().then((result) => {
                    setPageContents(result);
                });
            }

            loadPageData();
        } catch (error) {   
            console.log('Error Fetching Data: ', error.message);
        }
    }, [])

    console.log(pageContents);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;
    
        if (active.id !== over.id) {
          setItems((items) => {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
    
            return arrayMove(items, oldIndex, newIndex);
          });
        }
    };

    return (
    <div>
        <div className='App'> 
            <div className='layoutContainer'>
                <div className="Headline">
                    <Header />
                </div>
                <div className="page-view">
                    <div className="heading">
                        <div className="back">
                            <Back link={'/guides'}/>
                        </div>
                        <div className="page-title-sm">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mi purus, accumsan id eros et.</p>
                        </div>
                        <div className="page-save-btn">
                            <button >
                                Save & Publish
                            </button>
                        </div>
                    </div>
                    <main className='page-body'>
                        <div className="page-selector">
                            <button className='add-page-btn'>
                                + Add Page
                            </button>
                            <ul>
                                <li className='pages selected'>
                                    <Link to={'#'}>Page 1</Link>
                                </li>
                                <li className='pages'>
                                    <Link to={'#'}>Page 2</Link>
                                </li>
                                <li className='pages'>
                                    <Link to={'#'}>Page 3</Link>
                                </li>
                                <li className='pages'>
                                    <Link to={'#'}>Page 4</Link>
                                </li>
                                <li className='pages'>
                                    <Link to={'#'}>Page 5</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="page-edit">
                            <div className="cover-photo">

                            </div>
                            <div className="page-title-lg">
                                <div className="title">
                                    <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mi purus, accumsan id eros et.</h1>
                                </div>
                            </div>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragOver}
                            >
                                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                    {items.map((id) => (
                                        <Sortable key={id} id={id} />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </div>
    )

    function handleDragOver(event) {
        console.log("Drag end called");
        const {active, over} = event;
        console.log("ACTIVE: " + active.id);
        console.log("OVER: " + over.id);
        setIsDragging(false);
    };
}

export default GuidePage
