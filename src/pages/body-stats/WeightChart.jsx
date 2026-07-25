import '../../App.css';


function WeightChart({

  history,

  startWeight,

  targetWeight,

}) {



  if (!history || history.length < 2) {


    return (

      <p
        style={{
          marginTop:'20px'
        }}
      >

        Add more weight measurements to see chart.

      </p>

    );


  }







  const weights = history.map(

    item => Number(item.weight)

  );





  const target = Number(targetWeight);

  const start = Number(startWeight);





  const maxWeight =

    Math.max(

      ...weights,

      target,

      start

    ) + 2;





  const minWeight =

    Math.min(

      ...weights,

      target,

      start

    ) - 2;






  const chartHeight = 200;

  const chartWidth = 500;









  const points = history.map(

    (item,index)=>{


      const x =

        (

          index /

          (history.length - 1)

        )

        *

        chartWidth;







      const y =


        chartHeight -


        (

          (

            Number(item.weight)

            -

            minWeight

          )

          /

          (

            maxWeight

            -

            minWeight

          )

        )

        *

        chartHeight;






      return {

        x,

        y,

        weight:Number(item.weight),

        date:item.date

      };


    }

  );









  const line = points.map(

    (point,index)=>{


      if(index === 0){

        return `M ${point.x} ${point.y}`;

      }



      return ` L ${point.x} ${point.y}`;


    }

  ).join('');









  // Позиция линии цели

  const targetY =


    chartHeight -


    (

      (

        target -

        minWeight

      )

      /

      (

        maxWeight -

        minWeight

      )

    )

    *

    chartHeight;








  // Позиция линии старта

  const startY =


    chartHeight -


    (

      (

        start -

        minWeight

      )

      /

      (

        maxWeight -

        minWeight

      )

    )

    *

    chartHeight;









  return (


    <div

      style={{

        marginTop:'30px'

      }}

    >



      <h4>

        Weight progress 📈

      </h4>








      <svg

        width="100%"

        height="300"

        viewBox={

          `0 0 ${chartWidth} ${chartHeight + 80}`

        }

        style={{

          marginTop:'20px'

        }}

      >







        {/* Линия цели */}


        <line

          x1="0"

          y1={targetY}

          x2={chartWidth}

          y2={targetY}

          stroke="#3fd14b"

          strokeWidth="2"

          strokeDasharray="8 6"

        />





        <text

          x="5"

          y={targetY - 8}

          fontSize="12"

        >

          Goal {target}kg

        </text>









        {/* Линия старта */}


        <line

          x1="0"

          y1={startY}

          x2={chartWidth}

          y2={startY}

          stroke="#9c36b5"

          strokeWidth="2"

          strokeDasharray="8 6"

        />






        <text

          x="5"

          y={startY - 8}

          fontSize="12"

        >

          Start {start}kg

        </text>









        {/* Линия изменения веса */}


        <path

          d={line}

          fill="none"

          stroke="#0b57d0"

          strokeWidth="3"

        />









        {/* Точки веса */}


        {

          points.map(

            (point,index)=>(


              <g key={index}>


                <circle

                  cx={point.x}

                  cy={point.y}

                  r="6"

                  fill="#0b57d0"

                />







                <text

                  x={point.x}

                  y={point.y - 12}

                  textAnchor="middle"

                  fontSize="12"

                >

                  {point.weight}kg

                </text>








                <text

                  x={point.x}

                  y={chartHeight + 30}

                  textAnchor="middle"

                  fontSize="10"

                >

                  {

                    new Date(point.date)

                    .toLocaleDateString()

                  }

                </text>





              </g>


            )

          )

        }







      </svg>








      <p

        style={{

          marginTop:'10px'

        }}

      >

        Start:

        {' '}

        {startWeight} kg


        {' | '}


        Goal:

        {' '}

        {targetWeight} kg


      </p>







    </div>


  );


}



export default WeightChart;