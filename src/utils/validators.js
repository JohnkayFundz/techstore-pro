export function isEmail(email){

return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
.test(email);

}




export function required(value){

return value.trim().length > 0;

}