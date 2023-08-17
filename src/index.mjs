import "./styles.css";

// function to fetch data from api 
// accepts callback function which is executed after successful fetch of data

async function loadImages(callback, limit = 3, offset = 0) {
    let url = "https://api.slingacademy.com/v1/sample-data/photos";
    let query = `?limit=${limit}&offset=${offset}`;
    url = url + query;
    await fetch(url).then(res => res.json())
    .then(res => callback(res))
    .catch(error => console.log(error));
}
// function which creates the html elements from fetched data
// and renders on the DOM
function renderData(data){
  //console.log(data);
  const container = document.querySelector("#app");
  data.photos.forEach(item => {
    const img = document.createElement('img');
    img.src = item.url;
    img.width = 200;
    container.append(img);
    //console.log(container);
  })
};
//  loading initial data to be rendered on UI for first load

loadImages(renderData,3);

// this functions contains the logic of scroll effect i.e., when 
// should the scroll event should trigger to load data, 
// any private variable setup for the callback.
// this function gets executed as callback when our infinite
// scrollbar gets triggered. 
// It accepts a promise callback function
// which is called when scroll condition is met.

  function infinteScrollCallback(callback) {
    var calling = true;
    var offset = 3;
    var limit = 3;
    return () => {     
      console.log("before if: ", calling);
       
      if((document.documentElement.scrollHeight - (
      document.documentElement.scrollTop + 
      document.documentElement.clientHeight) < 50) && calling) {
        console.log(calling);
        calling = false;
        console.log("scrolled : " , document.documentElement.scrollHeight - (
          document.documentElement.scrollTop + 
          document.documentElement.clientHeight));
        callback(limit, offset).then(res => {
          offset += limit;
          calling = true;
          return;
        });
      }
    };
  }

 // this is the callback function which is passed in infite scroll method
 // this controls what action we need to perform once scroll condition is met.
 // it should return promise
 function afterScrollAction(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      loadImages(renderData,limit,offset)
      .then(res => resolve('success'));
//      resolve('success');
  });
}  

// method to add scroll event listener
// accepts a callback function  which is called on every scroll 
// event triggering
const infiniteScroll = (scrollcallback) => {
  window.addEventListener("scroll", scrollcallback);
}
// initializing the infinite scrollbar feature on DOM
  infiniteScroll(infinteScrollCallback(afterScrollAction));
