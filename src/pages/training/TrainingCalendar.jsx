import { useState } from 'react';
import { getLocalDateString } from './dateUtils';


function TrainingCalendar({
  trainings,
}) {


  const [selectedDate, setSelectedDate] = useState(null);



  const today = new Date();


  const year = today.getFullYear();


  const month = today.getMonth();





  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();







  const getDateString = (day) => {


    return getLocalDateString(

      new Date(
        year,
        month,
        day
      )

    );


  };







  const getTrainingsByDate = (date) => {


    return trainings.filter(

      (training) =>

        training.date === date

    );


  };








  const selectedTrainings =

    selectedDate

      ? getTrainingsByDate(selectedDate)

      : [];









  return (

    <div>


      <h3>
        Training calendar
      </h3>





      <h4>

        {today.toLocaleString(

          'default',

          {

            month: 'long',

            year: 'numeric'

          }

        )}

      </h4>









      <div

        style={{

          display: 'grid',

          gridTemplateColumns:

            'repeat(7, 1fr)',

          gap: '10px'

        }}

      >





        {Array.from(

          {

            length: daysInMonth

          },

          (_, index) => {


            const day = index + 1;



            const date =

              getDateString(day);





            const dayTrainings =

              getTrainingsByDate(date);





            return (


              <button

                key={day}


                onClick={() =>

                  setSelectedDate(date)

                }


                style={{

                  padding: '10px',

                  cursor: 'pointer'

                }}

              >


                {day}



                {dayTrainings.length > 0 && (


                  <div>

                    🔥

                  </div>


                )}



              </button>


            );


          }

        )}



      </div>









      {selectedDate && (

        <div

          style={{

            marginTop: '25px'

          }}

        >


          <h4>

            {selectedDate}

          </h4>









          {selectedTrainings.length > 0 ? (



            selectedTrainings.map(

              (training, index) => (



                <div

                  key={training.id}

                  style={{

                    marginBottom: '25px',

                    borderBottom:
                      '1px solid #ddd',

                    paddingBottom:
                      '15px'

                  }}

                >





                  <h4>

                    Training #{index + 1}

                  </h4>






                  {training.createdAt && (

                    <p>

                      Created at:

                      {' '}

                      {
                        new Date(
                          training.createdAt
                        )
                        .toLocaleTimeString(
                          [],
                          {
                            hour:'2-digit',
                            minute:'2-digit'
                          }
                        )
                      }


                    </p>

                  )}







                  {training.exercises.map(

                    (exercise, i) => (



                      <div

                        key={i}

                        style={{

                          marginTop:'10px'

                        }}

                      >



                        <strong>

                          {exercise.name}

                        </strong>





                        <ul className="food-list">


                          {exercise.sets.map(

                            (set, j) => (



                              <li

                                key={j}

                                className="food-item"

                              >


                                {set.weight} kg × {set.reps}


                              </li>


                            )

                          )}



                        </ul>



                      </div>


                    )

                  )}



                </div>


              )

            )



          ) : (


            <p>

              No training this day.

            </p>


          )}



        </div>

      )}



    </div>

  );

}


export default TrainingCalendar;