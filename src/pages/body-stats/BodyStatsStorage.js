const STORAGE_KEY = 'body-stats';



export const getBodyStats = () => {


  const data = localStorage.getItem(
    STORAGE_KEY
  );


  if (!data) {


    return {

      height:'',
      weight:'',
      startWeight:'',
      targetWeight:'',
      updatedAt:null,
      weightHistory:[]

    };


  }



  return JSON.parse(data);


};








export const saveBodyStats = (stats)=>{


  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(stats)

  );


};