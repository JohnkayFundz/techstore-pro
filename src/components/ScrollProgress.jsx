import {
  useEffect,
  useState,
} from "react";


function ScrollProgress(){


  const [progress,setProgress] =
    useState(0);



  useEffect(()=>{


    function handleScroll(){


      const scrollTop =
        window.scrollY;


      const documentHeight =
        document.documentElement.scrollHeight
        -
        document.documentElement.clientHeight;



      const percentage =
        (scrollTop / documentHeight) * 100;



      setProgress(
        percentage
      );


    }




    window.addEventListener(
      "scroll",
      handleScroll
    );



    return ()=>{

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };


  },[]);





  return (

    <div
      className="scroll-progress"
      style={{
        width:`${progress}%`
      }}
    />

  );

}


export default ScrollProgress;