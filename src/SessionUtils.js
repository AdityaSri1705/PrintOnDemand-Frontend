// sessionUtils.js

// Set a session variable
function setDiarySession(key, newValue) {
  //sessionStorage.setItem(key, JSON.stringify(value));
  console.log(key, newValue)

  const storedDiary = sessionStorage.getItem("Diary");
  var diaryObject = [];
  if (storedDiary) {
       diaryObject = JSON.parse(storedDiary);

      const updatedDiary = {
        ...diaryObject, // Copy the existing 'diary' object
        FrontPage: {
          newValue // Update with the new data
        }
      };
      console.log("updatedDiary=>",updatedDiary)
      
  }
  diaryObject[key] = newValue;
 
  console.log(diaryObject)

  // Save the modified Diary object back to sessionStorage
  sessionStorage.setItem("Diary", JSON.stringify(diaryObject));
}

// Get a session variable
function getDiarySession(key) {
  const storedDiary = sessionStorage.getItem("Diary");

  if (storedDiary) {
      const diaryObject = JSON.parse(storedDiary);
      //return diaryObject.FrontPage;
      return diaryObject[key];
  }
}

// Remove a session variable
function removeDiarySession(key) {
  const storedDiary = sessionStorage.getItem("Diary");

  if (storedDiary) {
      const diaryObject = JSON.parse(storedDiary);

      /*const updatedDiary = {
        ...diaryObject, // Copy the existing 'diary' object
        FrontPage: {}
      };*/
      diaryObject[key] = [];


      // Save the modified Diary object back to sessionStorage
      sessionStorage.setItem("Diary", JSON.stringify(diaryObject));
  }
}

export default {setDiarySession, getDiarySession, removeDiarySession};