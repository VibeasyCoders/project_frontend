function TrainingStats({
  trainings,
}) {


  let totalSets = 0;

  let totalVolume = 0;


  const exerciseStats = {};

  const records = {};





  trainings.forEach((training)=>{


    training.exercises.forEach((exercise)=>{



      if(!exerciseStats[exercise.name]){


        exerciseStats[exercise.name] = 0;


      }






      exercise.sets.forEach((set)=>{


        const weight =
          Number(set.weight);


        const reps =
          Number(set.reps);





        totalSets++;

        totalVolume +=
          weight * reps;






        exerciseStats[exercise.name]++;






        if(
          !records[exercise.name] ||
          weight > records[exercise.name]
        ){

          records[exercise.name] = weight;

        }



      });



    });



  });







  const sortedExercises =
    Object.entries(exerciseStats)
    .sort(
      (a,b)=>
        b[1]-a[1]
    );








  return (

    <div>


      <h3>
        Training statistics
      </h3>






      <div className="food-list">


        <div className="food-item">

          <span>
            Total workouts
          </span>


          <span>
            {trainings.length}
          </span>


        </div>





        <div className="food-item">

          <span>
            Total sets
          </span>


          <span>
            {totalSets}
          </span>


        </div>





        <div className="food-item">

          <span>
            Total volume
          </span>


          <span>
            {totalVolume} kg
          </span>


        </div>



      </div>









      <h4
        style={{
          marginTop:'25px'
        }}
      >
        Personal records
      </h4>





      <ul className="food-list">


        {Object.entries(records)
        .map(([name,weight])=>(


          <li
            key={name}
            className="food-item"
          >

            <span>
              {name}
            </span>


            <span>
              {weight} kg
            </span>


          </li>



        ))}


      </ul>









      <h4
        style={{
          marginTop:'25px'
        }}
      >
        Most trained exercises
      </h4>





      <ul className="food-list">


        {sortedExercises.map(
          ([name,count])=>(


            <li
              key={name}
              className="food-item"
            >


              <span>
                {name}
              </span>


              <span>
                {count} sets
              </span>


            </li>


          )

        )}


      </ul>






    </div>

  );

}


export default TrainingStats;