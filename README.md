PengWin is a mobile application to assist kids with Autism in completing their daily tasks by gamifying user defined activities and utilizing image recognition technology to validate the completion of each task.


To run the application:
 *database files are required*
 
- delete node modules
- delete packagelock json (or yarn lock)
- run yard add expo
- run expo install
- run expo start
- in a new tab cd into database folder:
- run nodemon routes.js localhost 3000


IF CAROUSEL IS BROKEN - **Only needed if working on ChildActivity.js**

Make below changes in node_modules/react-native-carousel-view/src/carousel.js

     componentDidMount() {
        this._resetPager();
        this.props.onRef(this);  // add this line
     }

Add these methods:

     componentWillMount(){
         this.props.onRef(undefined);
     }
     
    _onNext = () => {
        this.child._animateNextPage() // do stuff
    }
