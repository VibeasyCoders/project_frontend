import '../../App.css'

function StartTraining({
  exercises,
  sets,
  setSets,
  exercise,
  setExercise,
  weight,
  setWeight,
  reps,
  setReps,
  finishTraining,
}) {


  const addSet = () => {


    if (!exercise || !weight || !reps) {
      return;
    }



    setSets([

      ...sets,

      {
        exercise,
        weight,
        reps,
      }

    ]);



    setWeight('');

    setReps('');

  };





  const deleteSet = (index) => {


    setSets(

      sets.filter(
        (_, i) =>
          i !== index
      )

    );


  };







  return (

    <div>


      <h3>
        Current training
      </h3>






      <div className="auth-form">



        <div className="input-group">


          <label>
            Exercise
          </label>



          <select

            value={exercise}

            onChange={(e)=>
              setExercise(e.target.value)
            }

          >


            <option value="">
              Choose exercise
            </option>



            {exercises.map((item)=>(


              <option

                key={item.id}

                value={item.name}

              >

                {item.name}

              </option>


            ))}



          </select>


        </div>








        <div
          style={{
            display:'flex',
            gap:'10px'
          }}
        >



          <div
            className="input-group"
            style={{
              flex:1
            }}
          >

            <label>
              Weight (kg)
            </label>


            <input

              type="number"

              value={weight}

              onChange={(e)=>
                setWeight(e.target.value)
              }

            />


          </div>







          <div

            className="input-group"

            style={{
              flex:1
            }}

          >


            <label>
              Reps
            </label>


            <input

              type="number"

              value={reps}

              onChange={(e)=>
                setReps(e.target.value)
              }

            />


          </div>



        </div>







        <button

          type="button"

          className="login-button"

          onClick={addSet}

          style={{
            width:'100%',
            marginTop:'10px'
          }}

        >

          + Add set

        </button>



      </div>









      <div
        style={{
          marginTop:'30px'
        }}
      >



        <h4>
          Current sets
        </h4>






        {
          sets.length === 0 ?


          (

            <p>
              No sets yet.
            </p>

          )

          :

          (


            <ul className="food-list">


              {sets.map((set,index)=>(


                <li

                  key={index}

                  className="food-item"

                >



                  <span>

                    {set.exercise}

                  </span>





                  <span>

                    {set.weight} kg × {set.reps}


                    <button

                      onClick={() =>
                        deleteSet(index)
                      }

                      style={{
                        marginLeft:'10px'
                      }}

                    >

                      ❌

                    </button>


                  </span>



                </li>


              ))}



            </ul>


          )

        }






        <button

          className="log-food-button"

          onClick={finishTraining}

          style={{

            marginTop:'20px',

            width:'100%'

          }}

        >

          Finish training

        </button>





      </div>





    </div>

  );

}


export default StartTraining;