import { useState } from 'react';


function ExerciseManager({
  exercises,
  setExercises,
}) {


  const [newExercise, setNewExercise] = useState('');





  const addExercise = () => {


    if (!newExercise.trim()) {
      return;
    }



    const newItem = {


      id: Date.now(),


      name: newExercise.trim(),


    };




    setExercises([

      ...exercises,

      newItem,

    ]);



    setNewExercise('');

  };






  const deleteExercise = (id) => {


    setExercises(

      exercises.filter(
        (exercise) =>
          exercise.id !== id
      )

    );


  };







  return (

    <div>


      <h3>
        My exercises
      </h3>






      <div className="input-group">


        <label>
          Exercise name
        </label>



        <input

          type="text"

          value={newExercise}

          onChange={(e)=>
            setNewExercise(e.target.value)
          }

          placeholder="Example: Shoulder Press"

        />



      </div>





      <button

        className="auth-button"

        onClick={addExercise}

        style={{
          width:'100%',
          marginTop:'10px'
        }}

      >

        + Add exercise

      </button>







      <ul className="food-list"

        style={{
          marginTop:'25px'
        }}

      >


        {exercises.map((exercise)=>(


          <li

            key={exercise.id}

            className="food-item"

          >



            <span>

              {exercise.name}

            </span>





            <button

              onClick={() =>
                deleteExercise(exercise.id)
              }

            >

              ❌

            </button>




          </li>


        ))}


      </ul>




    </div>

  );

}


export default ExerciseManager;