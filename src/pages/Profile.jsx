import {
  useAuth
} from "../context/AuthContext";

import {
  useNavigate
} from "react-router-dom";


function Profile(){


const {
 user,
 logout
}=useAuth();



const navigate =
useNavigate();





const handleLogout=()=>{


logout();

navigate("/");


};






return (

<section className="container profile-page">


<h1>
👤 My Profile
</h1>



<div className="profile-card">


<h2>
{user.name}
</h2>



<p>
📧 {user.email}
</p>



<p>
⭐ TechStore Pro Member
</p>




<button

className="btn-danger"

onClick={handleLogout}

>

Logout

</button>



</div>


</section>

);


}


export default Profile;