import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

import {
  getTrainings,
  saveTrainings,
  getExercises,
  saveExercises,
} from './trainingStorage';

import { getLocalDateString } from './dateUtils';

import TrainingHistory from './TrainingHistory';
import TrainingForm from './TrainingForm';
import ExerciseManager from './ExerciseManager';
import TrainingStats from './TrainingStats';
import TrainingCalendar from './TrainingCalendar';



function Training() {


  const [activeTab, setActiveTab] = useState('history');



  const [trainings, setTrainings] = useState(() => {

    return getTrainings();

  });





  const [exercises, setExercises] = useState(() => {

    return getExercises();

  });





  // current training

  const [sets, setSets] = useState([]);


  const [exercise, setExercise] = useState('');


  const [weight, setWeight] = useState('');


  const [reps, setReps] = useState('');







  useEffect(() => {

    saveTrainings(trainings);

  }, [trainings]);







  useEffect(() => {

    saveExercises(exercises);

  }, [exercises]);









  const deleteTraining = (id) => {


    setTrainings(

      trainings.filter(
        (training) =>
          training.id !== id
      )

    );


  };









  const finishTraining = () => {


    if (sets.length === 0) {

      return;

    }







    const groupedExercises = [];







    sets.forEach((set) => {


      const existing =

        groupedExercises.find(

          (item) =>

            item.name === set.exercise

        );







      if (existing) {



        existing.sets.push({

          weight: set.weight,

          reps: set.reps,

        });




      } else {




        groupedExercises.push({

          name: set.exercise,


          sets: [

            {

              weight: set.weight,

              reps: set.reps,

            }

          ]

        });



      }



    });









    const newTraining = {



      id: Date.now(),




      date:

        getLocalDateString(),




      createdAt:

        new Date()
          .toISOString(),





      exercises:

        groupedExercises,



    };









    setTrainings([


      newTraining,


      ...trainings,


    ].sort(

      (a, b) =>

        new Date(b.createdAt || b.date)

        -

        new Date(a.createdAt || a.date)

    ));









    setSets([]);

    setExercise('');

    setWeight('');

    setReps('');



    setActiveTab('history');


  };













  return (


    <div className="page-layout">



      <Navbar />





      <div className="main-container">





        <header className="page-header">


          <h1>
            Training 💪
          </h1>



          <p className="page-subtitle">

            Create workouts and keep track of your progress.

          </p>


        </header>









        <main className="content">





          <div className="tabs-container">






            <button

              className={

                activeTab === 'history'

                ? 'tab-button active'

                : 'tab-button'

              }


              onClick={() =>
                setActiveTab('history')
              }

            >

              Training history

            </button>









            <button

              className={

                activeTab === 'create'

                ? 'tab-button active'

                : 'tab-button'

              }


              onClick={() =>
                setActiveTab('create')
              }


            >

              Start training

            </button>








            <button

              className={

                activeTab === 'exercises'

                ? 'tab-button active'

                : 'tab-button'

              }


              onClick={() =>
                setActiveTab('exercises')
              }


            >

              Exercises

            </button>









            <button

              className={

                activeTab === 'stats'

                ? 'tab-button active'

                : 'tab-button'

              }


              onClick={() =>
                setActiveTab('stats')
              }


            >

              Statistics

            </button>








            <button

              className={

                activeTab === 'calendar'

                ? 'tab-button active'

                : 'tab-button'

              }


              onClick={() =>
                setActiveTab('calendar')
              }


            >

              Calendar

            </button>





          </div>









          <div className="card">







            {activeTab === 'history' && (


              <TrainingHistory


                trainings={trainings}


                deleteTraining={deleteTraining}


              />


            )}









            {activeTab === 'create' && (


              <TrainingForm



                exercises={exercises}



                sets={sets}


                setSets={setSets}



                exercise={exercise}


                setExercise={setExercise}



                weight={weight}


                setWeight={setWeight}



                reps={reps}


                setReps={setReps}



                finishTraining={finishTraining}



              />


            )}









            {activeTab === 'exercises' && (



              <ExerciseManager



                exercises={exercises}



                setExercises={setExercises}



              />



            )}









            {activeTab === 'stats' && (



              <TrainingStats



                trainings={trainings}



              />



            )}









            {activeTab === 'calendar' && (



              <TrainingCalendar



                trainings={trainings}



              />



            )}







          </div>







        </main>







      </div>







    </div>


  );



}



export default Training;