import "./styles.css";

const infiniteScroll = () => ({
  url: "",
  limit: 5,
  offset: 0,
  //  loading initial data to be rendered on UI for first load
  init: function (data) {
    this.url = data.url;
    this.limit = data.limit;
    this.offset = data.offset;
    this.loadImages(this.renderData);
    this.infiniteScroll(
      this.infinteScrollCallback(this.afterScrollAction.bind(this))
    );
  },
  // function to fetch data from api
  // accepts callback function which is executed after successful fetch of data
  loadImages: async function (callback) {
    let url = this.url;
    let query = `?limit=${this.limit}&offset=${this.offset}`;
    url = url + query;
    await fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.offset += this.limit;
        callback(res);
      })
      .catch((error) => console.log(error));
  },
  // function which creates the html elements from fetched data
  // and renders on the DOM
  renderData: function (data) {
    //console.log(data);
    const container = document.querySelector("#app");
    data.photos.forEach((item) => {
      //console.log(item);
      const innerdata = `<div>
            <figure>
              <img src="${item.url}" width="200px" />
              <figcaption><span>${item.id} : </span> ${item.title}</figcaption>
            </figure>
            </div>`;
      container.innerHTML += innerdata;
    });
  },

  // this functions contains the logic of scroll effect i.e., when
  // should the scroll event should trigger to load data,
  // any private variable setup for the callback.
  // this function gets executed as callback when our infinite
  // scrollbar gets triggered.
  // It accepts a promise callback function
  // which is called when scroll condition is met.

  infinteScrollCallback: function (callback) {
    var calling = true;
    //var offset = this.offset;
    //var limit = this.limit;
    return () => {
      //console.log("before if: ", calling);

      if (
        document.documentElement.scrollHeight -
          (document.documentElement.scrollTop +
            document.documentElement.clientHeight) <
          50 &&
        calling
      ) {
        console.log(calling);
        calling = false;
        console.log(
          "scrolled : ",
          document.documentElement.scrollHeight -
            (document.documentElement.scrollTop +
              document.documentElement.clientHeight)
        );
        callback().then((res) => {
          calling = true;
          return;
        });
      }
    };
  },

  // this is the callback function which is passed in infite scroll method
  // this controls what action we need to perform once scroll condition is met.
  // it should return promise
  afterScrollAction: function () {
    return new Promise((resolve, reject) => {
      this.loadImages(this.renderData).then((res) => resolve("success"));
      //      resolve('success');
    });
  },

  // method to add scroll event listener
  // accepts a callback function  which is called on every scroll
  // event triggering
  infiniteScroll: function (scrollcallback) {
    window.addEventListener("scroll", scrollcallback);
  },
});

// initializing the infinite scrollbar feature on DOM

const infinite = new infiniteScroll();
infinite.init({
  url: "https://api.slingacademy.com/v1/sample-data/photos",
  limit: 5,
  offset: 0,
});
