import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import Environment from '../../../database/sqlEnv';


const { width: WIDTH } = Dimensions.get('window');


export default class Notifications extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Notifications',
        prevScreenTitle: 'Testing Home Page',
    });

    constructor(props) {
        super(props);
        this.state = {
            userId: 1,
            firstLoaded: false,
            loaded: false,
            childLoaded: false,
            childResults: null,
            routines: null,
            results: null,
            id: null,
            idsLoaded: false,

            childFirstName: null,
            childUserId: null,
            prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
            parentId: null,
            needsApproval: [],
        };
    }


    // This allows this page to refresh when you come back from
    // edit routines, which allows it to display any changes made
    componentDidMount() {
        this.getParentId();

        this.props.navigation.addListener('didFocus', payload => {
            this.getUserInfo(),
            this.getChildInfo();
            // this.getRoutines();
        });
    }
    
    getParentId(){
        fetch( Environment + '/getParentIdOfUser/' + this.state.userId, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
        .then(response => response.json())
        .then(responseJson => {
            return responseJson;
        })
        .then(results => {
            results = results[0];

            // console.log("WTFFFF");
            // console.log(results);

            var id = results.parent_id;
            this.setState({ parentId : id });
            this.getRoutinesAwaitingApproval();
        })
        .catch(error => {
            console.error(error);
        });
    }

    getRoutineById(routineId) {
        console.log("ROUTINE BY ID");
    
        fetch(Environment + "/joinRoutineAndActivityTable/" + routineId)
          .then((response) => response.json())
          .then((responseJson) => {
            return responseJson;
          })
          .then((results) => {
            // var rewardItem = results;
            this.setState({ routines: results });
            this.setState({ idsLoaded: true });
            console.log("RESULTS FOR ROUTINE BY ID BELOW");
            console.log(results);
          })
          .catch((error) => {
            console.error(error);
          });

      }


    getRoutinesAwaitingApproval(){
        fetch( Environment + '/getUnevaluatedRoutines/' + this.state.parentId, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
        .then(response => response.json())
        .then(responseJson => {
            return responseJson;
        })
        .then(results => {
            this.setState({needsApproval: results});
            console.log("UIEBUORFIOUWEABDIUNWAIUC");
            console.log(results);

            this.getRoutines();
        })
        .catch(error => {
            console.error(error);
        });
    }

    getChildInfo() {
        // Get the routines data from the db
        fetch( Environment + '/getChildFromParent/' + this.state.userId, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
            .then(response => response.json())
            .then(responseJson => {
                return responseJson;
            })
            .then(results => {
                this.setState({ childResults: results });
                console.log(this.state.childResults);
                this.setState({ childLoaded: true });
            })
            .catch(error => {
                console.error(error);
            });
    }

    getUserInfo() {
        // Get the routines data from the db
        fetch(Environment + '/getUser/' + this.state.userId, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
            .then(response => response.json())
            .then(responseJson => {
                return responseJson;
            })
            .then(results => {
                this.setState({ results: results });
                console.log(this.state.results);
                this.setState({ firstLoaded: true });
            })
            .catch(error => {
                console.error(error);
            });
    }

    getChildsName() {
        // console.log("LOK HEREEEEEE")
        // console.log(this.state.childResults[0].first_name);
        //this.setState({ childFirstName: this.state.childResults[0].first_name });

        return this.state.childResults.map(itemValue => {
            
            return (
                <Text>
                    {itemValue.first_name}
                </Text>
            );
        });
    }

    getRoutines(){
        console.log("need approval below");
        console.log(this.state.needsApproval);

        this.state.needsApproval.map((item) => {
            var id = item.routine_id;
            this.setState({id: item.routine_id});
            console.log("SHOULD BE ! BELOW");
            console.log(id);
            this.getRoutineById(id);
        });  
    }

    getRoutinesName() {
        // for (var i; i < this.state.needsApproval.length; i++){
        //     needsApproval[i]
        // }
        console.log("R WE IN ROUTINESNAME");
        return(
            <Text>{this.state.routines[0].routine_name}</Text>
        );
    }
    //     return this.state.routines.map((item) => {
    //         console.log(item.routine_name);
    //         return (
    //             <Text>{item.routine_name}</Text>
    //         );
    //     });     
    // }

    fieldRef = React.createRef();
    //fix hard coding in the navigation below
    render() {
        const { navigate } = this.props.navigation;

        return (




            <View>
                <View style={{ flex: 1 }, styles.notificationContainer}
                    onStartShouldSetResponder={() => this.props.navigation.navigate('RoutineApproval', {
                        prevScreenTitle: 'Notifications',
                        routineName: 'Morning Routine',
                        routineID: this.state.id,
                        childFirstName: this.state.childFirstName, 
                    })}>

                    <Text style={styles.text}>
                        Check Off Routine
                    </Text>

                    {this.state.firstLoaded && this.state.childLoaded && this.state.idsLoaded && (
                        
                        <View>         
                         <Text style={styles.textFields}>{this.getChildsName()} has marked {this.getRoutinesName()} complete. Would you like to approve the routine to let {this.getChildsName()} claim his reward?</Text>
                        </View>
                    )}


                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({

    notificationContainer: {
        backgroundColor: 'rgba(255, 105, 120, 0.13)',
    },

    text: {
        marginLeft: 48,
        fontSize: 24,
        marginBottom: 1,
        marginTop: 1,

    },

    textFields: {
        padding: 5,
        margin: 2,
        marginLeft: 45,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 20,
        marginRight: 170,

    },
    formIndent: {
        marginLeft: 30,
    },

    routineDetails: {
        fontSize: 10,
        paddingTop: 15,
        paddingLeft: 15,
    },

    detailsContainer: {
        padding: 2,
        paddingTop: 10,
        paddingBottom: 15,
    },
    routines: {
        paddingLeft: 3,
        textAlignVertical: 'center',
        width: WIDTH * 0.3,
        height: 100,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 3,
        borderRadius: 15,
        backgroundColor: 'white',
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'black',
        shadowOpacity: 0.1,
    },
    routineTitle: {
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});
