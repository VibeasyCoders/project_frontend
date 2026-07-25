import { useState } from 'react';
import BMIInfo from './BMIInfo';
import '../../App.css';

import Navbar from '../../components/Navbar';

import {
  getBodyStats,
  saveBodyStats
} from './BodyStatsStorage';

import WeightChart from './WeightChart';



function BodyStats() {


  const savedStats = getBodyStats();



  const [height, setHeight] = useState(
    savedStats.height
  );


  const [currentWeight, setCurrentWeight] = useState(
    savedStats.currentWeight
  );


  const [targetWeight, setTargetWeight] = useState(
    savedStats.targetWeight || ''
  );


  const [editingTarget, setEditingTarget] = useState(false);


  const [stats, setStats] = useState(
    savedStats
  );






  const calculateBMI = () => {


    if (!height || !currentWeight) {

      return null;

    }



    const meters =
      Number(height) / 100;



    return Number(

      (

        Number(currentWeight) /
        (meters * meters)

      ).toFixed(1)

    );


  };







  const getStatus = (bmi) => {


    if (!bmi) {

      return null;

    }



    if (bmi < 18.5) {

      return {
        icon: '⬇️',
        text: 'Underweight'
      };

    }



    if (bmi < 25) {

      return {
        icon: '✅',
        text: 'Normal weight'
      };

    }



    if (bmi < 30) {

      return {
        icon: '⚠️',
        text: 'Overweight'
      };

    }



    return {

      icon: '❗',

      text: 'Obesity'

    };


  };









  const updateStats = () => {


    let newStats;



    if (!stats.startWeight) {


      newStats = {


        height,


        startWeight:
          currentWeight,


        currentWeight,


        targetWeight,



        weightHistory: [


          {

            date:
              new Date()
              .toISOString(),

            weight:
              currentWeight

          }


        ],



        updatedAt:
          new Date()
          .toISOString()


      };


    }


    else {


      newStats = {


        ...stats,


        height,


        currentWeight,


        targetWeight,



        weightHistory: [


          ...stats.weightHistory,


          {


            date:
              new Date()
              .toISOString(),


            weight:
              currentWeight


          }


        ],



        updatedAt:
          new Date()
          .toISOString()


      };


    }






    saveBodyStats(
      newStats
    );


    setStats(
      newStats
    );


    setEditingTarget(false);


  };









  let progress = 0;



  if (

    stats.startWeight &&

    stats.targetWeight &&

    stats.currentWeight

  ) {



    const start =
      Number(stats.startWeight);



    const current =
      Number(stats.currentWeight);



    const target =
      Number(stats.targetWeight);





    const totalDistance =
      Math.abs(
        start - target
      );





    let completedDistance;



    if (target < start) {


      completedDistance =
        start - current;


    }

    else {


      completedDistance =
        current - start;


    }







    progress = Math.round(

      (

        completedDistance /
        totalDistance

      )

      * 100

    );







    if (progress < 0) {

      progress = 0;

    }



    if (progress > 100) {

      progress = 100;

    }


  }









  let weightLeft = 0;

let goalAchieved = false;



if (

  stats.currentWeight &&

  stats.targetWeight &&

  stats.startWeight

) {


  const current = Number(
    stats.currentWeight
  );


  const target = Number(
    stats.targetWeight
  );


  const start = Number(
    stats.startWeight
  );




  // Похудение

  if(start > target){


    if(current <= target){

      goalAchieved = true;

    }


  }





  // Набор веса

  else if(start < target){


    if(current >= target){

      goalAchieved = true;

    }


  }




  if(!goalAchieved){


    weightLeft = Math.abs(

      current -

      target

    );


  }


}







  const bmi =
    calculateBMI();




  const status =
    getStatus(bmi);









  return (

    <div className="page-layout">


      <Navbar />



      <div className="main-container">



        <header className="page-header">


          <h1>
            Body Stats 💪
          </h1>


          <p className="page-subtitle">

            Track your body progress.

          </p>


        </header>








        <main className="content">







          <div className="card">


            <h3>
              Body measurements
            </h3>





            <div className="input-group">


              <label>
                Height (cm)
              </label>


              <input

                type="number"

                value={height}

                onChange={(e)=>
                  setHeight(e.target.value)
                }

              />


            </div>







            <div className="input-group">


              <label>
                Current weight (kg)
              </label>


              <input

                type="number"

                value={currentWeight}

                onChange={(e)=>
                  setCurrentWeight(e.target.value)
                }

              />


            </div>







            {


                (!stats.targetWeight || editingTarget)

                &&

                (


                <div className="input-group">


                <label>
                Target weight (kg)
                </label>



                <input

                type="number"

                value={targetWeight}

                onChange={(e)=>
                setTargetWeight(e.target.value)
                }

                />



                </div>


                )


                }






                {


                stats.targetWeight

                &&

                !editingTarget

                &&

                (


                <div

                className="card"

                style={{

                marginTop:'15px'

                }}

                >


                <h3>
                🎯 Target weight
                </h3>



                <p

                style={{

                fontSize:'28px',

                fontWeight:'700',

                marginTop:'10px'

                }}

                >

                {stats.targetWeight} kg


                </p>




                <button

                className="login-button"

                style={{

                marginTop:'15px',

                width:'100%'

                }}


                onClick={()=>setEditingTarget(true)}

                >

                ✏️ Edit target weight


                </button>



                </div>


                )


                }







            <button

              className="login-button"

              onClick={updateStats}

            >

              Update stats

            </button>



          </div>












          {

            stats.startWeight && (



              <>


              <div

                className="card"

                style={{

                  marginTop:'20px',

                  marginBottom:'20px'

                }}

              >


                <h3>
                  Weight goal 🎯
                </h3>





                <div

                  style={{

                    fontSize:'36px',

                    fontWeight:'700',

                    margin:'20px 0'

                  }}

                >

                  {progress}% 🔥


                </div>







                <div

                  style={{

                    height:'12px',

                    background:'#eee',

                    borderRadius:'10px',

                    overflow:'hidden'

                  }}

                >


                  <div

                    style={{

                      height:'100%',

                      width:`${progress}%`,

                      background:'#0b57d0',

                      borderRadius:'10px',

                      transition:'0.3s'

                    }}

                  />


                </div>







                <ul className="food-list"

                  style={{

                    marginTop:'20px'

                  }}

                >



                  <li className="food-item">

                    <span>
                      Current
                    </span>

                    <span>
                      {stats.currentWeight} kg
                    </span>

                  </li>





                  <li className="food-item">

                    <span>
                      Target
                    </span>

                    <span>
                      {stats.targetWeight} kg
                    </span>

                  </li>





                  <li className="food-item">

                    <span>
                      Remaining
                    </span>


                    <span>


                      {

                        goalAchieved

                        ?

                        '🏆 Goal achieved'

                        :

                        `${weightLeft} kg`

                      }


                    </span>


                  </li>



                </ul>


              </div>









              <div

                className="card"

              >



                <h3>
                  Progress 🔥
                </h3>






                <ul className="food-list">



                  <li className="food-item">

                    <span>
                      Start weight
                    </span>


                    <span>
                      {stats.startWeight} kg
                    </span>


                  </li>





                  <li className="food-item">


                    <span>
                      BMI
                    </span>


                    <span>
                      {bmi}
                    </span>


                  </li>



                </ul>








                {

                  status && (


                    <p

                      style={{

                        marginTop:'20px',

                        fontWeight:'600',

                        fontSize:'18px'

                      }}

                    >

                      {status.icon}

                      {' '}

                      {status.text}


                    </p>


                  )

                }




                <BMIInfo

                    height={stats.height}
                     bmi={bmi}

                    />



                <WeightChart

                  history={
                    stats.weightHistory
                  }


                  startWeight={
                    stats.startWeight
                  }


                  targetWeight={
                    stats.targetWeight
                  }


                />




              </div>



              </>


            )

          }






        </main>



      </div>



    </div>


  );


}



export default BodyStats;