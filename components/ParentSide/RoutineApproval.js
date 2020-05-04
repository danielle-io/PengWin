import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import Environment from '../../database/sqlEnv';
import {
    MenuProvider,
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from "react-native-popup-menu";

const { width: WIDTH } = Dimensions.get('window');

export default class RoutineApproval extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Approve Routine",
        
    });

    constructor(props) {
        super(props);

        const { navigate } = this.props.navigation;
        this.navigate = navigate;

        this.state = {
            userID: 1,
            routineName: this.props.navigation.state.params.routineName,
            routineID: this.props.navigation.state.params.routineID, 
            prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
            activities: null,
            activitiesLoaded: false,
            childFirstName: this.props.navigation.state.params.childFirstName,
        };
    }

    

    // //create a filter activities based on data from the relationship table (WTF HOW?!!)
    // getActivitiesFromRoutine() {
    //     fetch(Environment + '/getActivitiesFromRoutine/' + this.state.routineID, {
    //         headers: {
    //             "Cache-Control": "no-cache",
    //         },
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             return responseJson;
    //         })
    //         .then((results) => {
    //             this.setState({ activities: results });
    //             this.setState({ activitiesLoaded: true });
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }

    getActivities() {
        fetch(
          Environment +
            "/joinRoutineAndActivityTable/" +
            this.state.routineID,
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            return responseJson;
          })
          .then((results) => {
            this.setState({ activities: results });
            this.setState({ activitiesLoaded: true });
          })
          .catch((error) => {
            console.error(error);
          });
    }

    componentDidMount() {
        console.log('running component did mount for ROUTINE APPROVAL ');
        this.props.navigation.addListener('didFocus', payload => {
            this.getActivities();
            
        });
    }

    displayActivities() {
        const { navigate } = this.props.navigation;

        return this.state.activities.map((item) => {
            return (
                <View>
                    <Text style={styles.activityName}>
                        {item.activity_id}. {item.activity_name}
                    </Text>
                    {/* <Text style={styles.subtext}>
                        Image taken by {this.state.childFirstName}
                    </Text> */}
                </View>
            );
        });
    }

    render() {
        if (this.state.results !== null) {
            console.log(this.state.results);
        } else {
            console.log('null below');
            // return null;
            // IS THIS WHERE I MAYBE MAKE ANOTHER CALL ?
        }
        return (
            
            <View>
                {this.state.activitiesLoaded && (
                    <View>
                        {this.displayActivities()}
                    </View>
                )}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    // RoutinesPage
    topContainer: {
        zIndex: 999,
    },
    text: {
        marginTop: 7,
        fontSize: 24,
        textAlign: "center",
        height: 100,
    },
    activityName: {
        marginTop: 20, 
        fontSize:24,
        fontWeight: '700',
        paddingHorizontal: 20,
    },
    subtext: {
        marginTop: -40,
        fontSize: 20,
        textAlign: "center",
        textAlignVertical: "auto",
        width: 220,
        marginBottom: 25,
    },
    dialog: {
        backgroundColor: "#e1d8ff",
    },
    routineTitleAndMenu: {
        flexDirection: "row",
        flex: 1,
        overflow: "visible",
    },
    ellipsis: {
        flexDirection: "row",
        alignSelf: "flex-end",
        fontSize: 30,
        marginRight: 10,
        overflow: "visible",
    },
    routineTitle: {
        marginLeft: 4,
        marginTop: 2,
        fontSize: 14,
        textAlign: "center",
        flex: 1,
    },
    routineContainterOptions: {
        overflow: "visible",
        zIndex: 999,
    },
    routineOptionsPopout: {
        overflow: "visible",
        zIndex: 999,
    },
    routineMenuStyling: {
        overflow: "visible",
        zIndex: 999,
    },
    routineDetailsIcon: {
        color: "#355C7D",
        fontSize: 14,
    },
    routineDetails: {
        fontSize: 10,
        zIndex: 2,
    },
    routineDetailsPreview: {
        zIndex: 2,
        marginBottom: 10,
        marginLeft: 5,
    },
    selectText: {
        fontSize: 15,
        padding: 5,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
    },

    routineContainer: {
        width: WIDTH * 0.3,
        height: 150,
        marginTop: 20,
        marginBottom: 5,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "black",
        shadowOpacity: 0.1,
        borderWidth: 0,
        paddingTop: 10,
        overflow: "visible",
        marginLeft: 10,
        marginRight: 10,
    },
    inactiveRoutineContainer: {
        width: WIDTH * 0.3,
        height: 150,
        marginTop: 20,
        marginBottom: 5,
        justifyContent: "space-around",
        borderRadius: 10,
        backgroundColor: "#d3d3d3",
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "black",
        shadowOpacity: 0.1,
        borderWidth: 0,
        paddingTop: 10,
        overflow: "visible",
        marginLeft: 10,
        marginRight: 10,
    },

    roundAddButton: {
        marginLeft: 6,
        fontSize: 30,
        height: 50,
        minWidth: 50,
        width: 50,
        borderRadius: 50,
        color: "#FFFFFF",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
});
