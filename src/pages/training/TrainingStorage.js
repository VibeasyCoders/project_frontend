const TRAININGS_KEY = 'trainings';
const EXERCISES_KEY = 'exercises';


// Получить тренировки
export function getTrainings() {

  const savedTrainings =
    localStorage.getItem(TRAININGS_KEY);


  if (!savedTrainings) {
    return [];
  }


  return JSON.parse(savedTrainings);

}




// Сохранить тренировки
export function saveTrainings(trainings) {

  localStorage.setItem(
    TRAININGS_KEY,
    JSON.stringify(trainings)
  );

}





// Получить упражнения
export function getExercises() {

  const savedExercises =
    localStorage.getItem(EXERCISES_KEY);


  if (!savedExercises) {


    return [
      {
        id: 1,
        name: 'Bench Press'
      },

      {
        id: 2,
        name: 'Squat'
      },

      {
        id: 3,
        name: 'Deadlift'
      },

      {
        id: 4,
        name: 'Pull Up'
      }
    ];

  }


  return JSON.parse(savedExercises);

}





// Сохранить упражнения
export function saveExercises(exercises) {

  localStorage.setItem(
    EXERCISES_KEY,
    JSON.stringify(exercises)
  );

}