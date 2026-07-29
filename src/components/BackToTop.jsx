import {
  useEffect,
  useState,
} from "react";


function BackToTop(){


  const [visible,setVisible] =
    useState(false);





  useEffect(()=>{


    function handleScroll(){


      setVisible(
        window.scrollY > 400
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







  function scrollTop(){


    window.scrollTo({

      top:0,

      behavior:"smooth",

    });


  }





  if(!visible)
    return null;




  return (

    <button

      className="back-to-top"

      onClick={scrollTop}

      aria-label="Back to top"

    >

      ↑

    </button>

  );

}


export default BackToTop;