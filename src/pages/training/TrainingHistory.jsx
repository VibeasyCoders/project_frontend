function TrainingHistory({
  trainings,
  deleteTraining,
}) {


  return (

    <div>


      <h3>
        My trainings
      </h3>




      {trainings.length === 0 ? (


        <p>
          No trainings yet.
        </p>


      ) : (



        trainings.map((training) => (


          <div

            key={training.id}

            style={{

              border: '1px solid #ddd',

              borderRadius: '8px',

              padding: '15px',

              marginBottom: '15px',

            }}

          >





            <div

              style={{

                display:'flex',

                justifyContent:'space-between',

                alignItems:'center',

              }}

            >



              <h4>
                {training.date}
              </h4>





              <button

                onClick={() =>
                  deleteTraining(training.id)
                }

              >

                Delete

              </button>




            </div>








            {training.exercises.map(
              (exercise, index) => (



                <div

                  key={index}

                  style={{

                    marginTop:'10px'

                  }}

                >



                  <strong>

                    {exercise.name}

                  </strong>






                  <ul className="food-list">



                    {exercise.sets.map(
                      (set, idx) => (



                        <li

                          key={idx}

                          className="food-item"

                        >

                          {set.weight} kg × {set.reps} reps


                        </li>



                      )

                    )}



                  </ul>




                </div>



              )

            )}






          </div>



        ))



      )}




    </div>

  );

}


export default TrainingHistory;