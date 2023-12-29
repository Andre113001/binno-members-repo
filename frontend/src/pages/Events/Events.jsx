import EventCards from './EventCards.jsx'
import SideBar from '../../components/sidebar/SideBar';
import Header from '../../components/header/Header.jsx';
import Modal from '../../components/modal/modal.jsx'
import styles from './Events.module.css'

function Events() {

  return (
    <>
    <div className={styles['EventsPage']}>
      <SideBar />
      <div className={styles['layoutContainer']}>
          <div className={styles["Headline"]}>
            <Header />
          </div>
              <div className={styles["bodyContainer"]}>
                <h1>Events</h1>
                  <div className={styles["blogButtons"]}> {/*create button container*/}
                    <div className={styles["modalButton"]}>
                      <Modal />
                  </div>
                  </div>
                  <h2>Upcoming Events</h2>
                    <div className={styles["modalButton"]}> {/*conntent section container*/}
                      <EventCards />
                    </div>
              </div>
        </div>        
      </div>

    </>
  )
}

export default Events
