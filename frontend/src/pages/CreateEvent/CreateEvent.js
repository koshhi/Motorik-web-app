// import React from 'react';
// import EventForm from '../../components/EventForm/EventForm'
// import styles from './CreateEvent.module.scss';


// const CreateEvent = () => {

//   return (
//     <>
//       <header className={styles.topbar}>
//         <nav className={styles.container}>
//           <h1 className={styles.heading}>Crear Evento</h1>
//           <div className={styles.links}>
//             <button className='button' >Descartar</button>
//             <button className='button' >Crear Evento</button>
//           </div>
//         </nav>
//       </header>
//       <EventForm />
//     </>
//   );
// };

// export default CreateEvent;

import React, { useRef } from 'react';
import EventForm from '../../components/EventForm/EventForm';
import styles from './CreateEvent.module.scss';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleDiscard = () => {
    navigate('/');
  };

  const handleCreateEvent = () => {
    if (formRef.current) {
      formRef.current.submitForm(); // Llama a la función submitForm del formulario
    }
  };

  return (
    <>
      <header className={styles.topbar}>
        <nav className={styles.container}>
          <h1 className={styles.heading}>Crear Evento</h1>
          <div className={styles.links}>
            <button className='button' onClick={handleDiscard}>Descartar</button>
            <button className='button' onClick={handleCreateEvent}>Crear Evento</button>
          </div>
        </nav>
      </header>
      <EventForm ref={formRef} />
    </>
  );
};

export default CreateEvent;
