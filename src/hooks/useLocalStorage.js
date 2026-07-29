import {
  useState,
  useEffect,
} from "react";


function useLocalStorage(
  key,
  initialValue
){


  const [value,setValue] =
    useState(()=>{


      try{

        const saved =
          localStorage.getItem(key);


        return saved
          ? JSON.parse(saved)
          : initialValue;


      }catch(error){

        console.error(error);

        return initialValue;

      }


    });





  useEffect(()=>{


    localStorage.setItem(

      key,

      JSON.stringify(value)

    );


  },[
    key,
    value
  ]);




  return [
    value,
    setValue
  ];

}


export default useLocalStorage;