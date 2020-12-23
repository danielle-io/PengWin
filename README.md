<h1>PengWin :penguin:</h1>

<h2>About</h2>
PengWin is a mobile application to assist kids with Autism in completing their daily tasks by gamifying user defined activities and utilizing image recognition technology to validate the completion of each task.

This application is designed for Apple iPads, but testing can be done on mobile devices if needed as well.

<h2>Tech Used:</h2>
<ul>
 <li>Framework: React Native with Expo</li>
 <li>Image database: Firebase</li>
 <li>Database: MySql</li>
 <li>Hosted: Google Cloud Platform</li>
 <li>Image Recognition API: Google Vision</li>
</ul>


Demo: https://www.youtube.com/watch?v=H22GVl9oUnw&feature=youtu.be

<h2>To Run:</h2>
Note: *database files are required* to run the application. This app uses Firebase and MySql.
 
Install expo:
<pre><code>yarn add expo</code></pre>

To install Node Modules:
<pre><code>expo install</code></pre>

To start expo (a browser will open with options to run app in simulator or on a device):
<pre><code>expo start</code></pre>

In a new tab cd into database folder and run:
<pre><code>nodemon routes.js localhost 3000</code></pre>


<h2>Support:</h2>

If carousel is broken- **Only needed if working on ChildActivity.js**

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
