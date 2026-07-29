export function getStorage(key, fallback){

    try{

        const item =
            localStorage.getItem(key);


        return item
        ? JSON.parse(item)
        : fallback;


    }catch(error){

        console.error(
            error
        );

        return fallback;

    }

}





export function setStorage(
    key,
    value
){

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}