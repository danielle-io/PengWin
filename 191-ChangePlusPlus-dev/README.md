TO RUN THE CODE
1. cd into the repo
2. npm start 

TO RUN THE DATABASE SERVER
in a new shell tab
1. cd into database folder
2. nodemon routes.js localhost 3000

TO RUN THE SIMULATOR
in a new shell tab
1. cd into repo
2. npx react-native run-ios --simulator="iPad Pro (11-inch)"


~ workflow ~

from YOUR branch:
1. git fetch origin
2. git merge origin/dev

^ this will merge dev onto your branch.
make sure everything is tested and working before you do the next steps. 
only put working code on Dev, it should be working at all times.

3. git add .
4. git commit -m "message"
5. git push origin **your branch name**

6. git checkout dev
7. git merge origin/dev

** this is bc the first merge only merged into ur local branch**

8. git merge **your branch name**
9. test one more time, make sure everything is working correctly.
10. git push origin dev


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