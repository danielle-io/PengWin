delete node modules

delete packagelock json (or yarn lock)

then run these in order:

yard add expo

expo install

expo start


**** DB ***
In a new tab cd into database folder

nodemon routes.js localhost 3000


IF CAROUSEL IS BROKEN - **Only needed if working on ChildActivity.js**
Delete node_modules folder and package-lock.json

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


Icon Library: https://oblador.github.io/react-native-vector-icons/
