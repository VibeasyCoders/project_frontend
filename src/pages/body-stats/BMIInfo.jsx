import '../../App.css';



function BMIInfo({

  height,

  bmi

}) {



  if (!height || !bmi) {


    return null;


  }






  const meters =

    Number(height) / 100;





  const minWeight =

    (

      18.5 *

      meters *

      meters

    ).toFixed(1);





  const maxWeight =

    (

      24.9 *

      meters *

      meters

    ).toFixed(1);








  let position;



  if (bmi < 18.5) {


    position = 10;


  }

  else if (bmi < 25) {


    position = 45;


  }

  else if (bmi < 30) {


    position = 70;


  }

  else {


    position = 90;


  }








  let category;



  if (bmi < 18.5) {


    category = '⬇️ Underweight';


  }

  else if (bmi < 25) {


    category = '✅ Normal weight';


  }

  else if (bmi < 30) {


    category = '⚠️ Overweight';


  }

  else {


    category = '❗ Obesity';


  }







  return (


    <div

      style={{

        marginTop:'25px'

      }}

    >





      <h4>

        BMI analysis

      </h4>








      <p

        style={{

          fontSize:'22px',

          fontWeight:'700',

          margin:'15px 0'

        }}

      >

        BMI: {bmi}


      </p>







      <div

        style={{

          position:'relative',

          height:'14px',

          borderRadius:'10px',

          background:

          'linear-gradient(to right, #74c0fc 0%, #74c0fc 25%, #69db7c 25%, #69db7c 55%, #ffd43b 55%, #ffd43b 75%, #ff8787 75%)'

        }}

      >



        <div

          style={{

            position:'absolute',

            top:'-6px',

            left:`${position}%`,

            width:'24px',

            height:'24px',

            borderRadius:'50%',

            background:'#0b57d0',

            transform:'translateX(-50%)'

          }}

        />



      </div>







      <div

        style={{

          display:'flex',

          justifyContent:'space-between',

          fontSize:'12px',

          marginTop:'8px'

        }}

      >

        <span>
          18.5
        </span>


        <span>
          25
        </span>


        <span>
          30
        </span>


      </div>







      <p

        style={{

          marginTop:'20px',

          fontWeight:'600'

        }}

      >

        {category}


      </p>







      <div

        className="card"

        style={{

          marginTop:'20px',

          background:'#f8f9fa'

        }}

      >


        <h4>

          Recommended weight

        </h4>


        <p

          style={{

            marginTop:'10px',

            fontSize:'18px'

          }}

        >

          {minWeight}

          {' - '}

          {maxWeight}

          {' kg'}

        </p>



      </div>





    </div>


  );


}



export default BMIInfo;