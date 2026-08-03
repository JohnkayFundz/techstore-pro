import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Line,
} from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);



function SalesChart({
  salesData = [],
}) {


  if (!salesData.length) {

    return (

      <section className="sales-chart">

        <h2>
          Sales Overview
        </h2>


        <p>
          No sales data available.
        </p>

      </section>

    );

  }



  const data = {

    labels: salesData.map(
      item => item.month
    ),


    datasets: [

      {

        label: "Revenue",

        data: salesData.map(
          item => item.sales
        ),


        tension: 0.4,


        fill: true,


        borderWidth: 3,


        pointRadius: 5,

      },

    ],

  };



  const options = {


    responsive:true,


    maintainAspectRatio:false,


    plugins:{


      legend:{

        position:"top",

      },


      tooltip:{


        callbacks:{


          label:(context)=>{

            return `Revenue: ₦${context.raw.toLocaleString()}`;

          },


        },


      },


    },



    scales:{


      y:{


        ticks:{


          callback:(value)=>
            `₦${value.toLocaleString()}`,


        },


      },


    },


  };




  return (

    <section className="sales-chart">


      <h2>
        Sales Overview
      </h2>



      <div className="chart-container">


        <Line
          data={data}
          options={options}
        />


      </div>



    </section>

  );

}



export default SalesChart;