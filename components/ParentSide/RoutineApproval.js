import React, { Component } from 'react';
import { View, Dimensions, Image, StyleSheet, Text } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import Environment from '../../database/sqlEnv';
import Carousel from "react-native-carousel-view";


const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export default class RoutineApproval extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Approve Routine",
    });

    constructor(props) {
        super(props);

        const { navigate } = this.props.navigation;
        this.navigate = navigate;

        this.state = {
            userId: 1,
            routineName: this.props.navigation.state.params.routineName,
            routineID: this.props.navigation.state.params.routineID, 
            prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
            activities: null,
            activitiesLoaded: false,
            childResults: null,
            childLoaded: false,
            
            
        };
    }
    getChildInfo() {
        fetch(Environment + '/getChildFromParent/' + this.state.userId, {
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
                this.setState({ childLoaded: true });
                
            })
            .catch(error => {
                console.error(error);
            });
    }

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
    
    getChildsName() {
        return this.state.childResults.map(itemValue => {
            return (
                <Text>{itemValue.first_name}</Text>
            );
        });
    }
    componentDidMount() {
        this.props.navigation.addListener('didFocus', payload => {
            this.getActivities();
            this.getChildInfo();
        });
    }

    displayActivities() {
        const { navigate } = this.props.navigation;
        
        return (
            <View>
                <Carousel 
                height={HEIGHT * 0.9}
                hideIndicators={false}
                indicatorSize={12}
                animate={false}
                onRef={(ref) => (this.child = ref)}
                >
                {this.state.activities.map((item) => (
                    <View style={styles.carouselContainer}>
                        
                        <Text style={styles.activityName}>{item.activity_name}</Text>
                        
                        <Text style={styles.subtext}>Image taken by Alex</Text> 
                        
           
                        {item.image_path && (
                        <View
                        style={{ justifyContent: "center", alignItems: "center" }}
                        >
                        <Image
                            source={{ uri: item.image_path }}
                            style={{
                            width: 300,
                            height: 200,
                            margin: 5,
                            borderRadius: 15,
                            resizeMode: "contain",
                            }}
                            />
                        </View>
                            )}

                    </View> 
                
                ))}   
                </Carousel>    
            </View>
        );
    }

    render() {
        if (this.state.results !== null) {
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
    topContainer: {
        zIndex: 999,
    },
    carouselContainer:{
        backgroundColor: "#E5E5E5",   
    },
    activities: {
        backgroundColor: "#FF6978",
        padding: WIDTH * 0.01,
        margin: WIDTH * 0.01,
        borderRadius: 1,
        width: WIDTH * 0.98,
        height: HEIGHT,
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
        marginTop: 0,
        fontSize: 20,
        textAlign: "center",
        textAlignVertical: "auto",
        width: 220,
        marginBottom: 25,
    },
    dialog: {
        backgroundColor: "#e1d8ff",
    },
    selectText: {
        fontSize: 15,
        padding: 5,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
});
