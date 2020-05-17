
import React, { Component } from "react";
import {
  Button,
  Dimensions,
  Picker,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Table, TableWrapper, Row, Cell, Col, Cols } from 'react-native-table-component';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
export default class Progress extends Component {


    constructor(props) {
        super(props);
        const elementButton = (value) => (
            <TouchableOpacity onPress={() => this._alertIndex(value)}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>button</Text>
              </View>
            </TouchableOpacity>
          );
      
          this.state = {
            tableTitle: ['Title', 'Title2', 'Title3', 'Title4'],
            tableData: [
              [elementButton('1'), 'a', 'b', 'c', 'd'],
              [elementButton('2'), '1', '2', '3', '4'],
              [elementButton('3'), 'a', 'b', 'c', 'd']
            ]
          }
        }
      
        _alertIndex(value) {
          Alert.alert(`This is column ${value}`);
        }
    fieldRef = React.createRef();

    render() {

        const state = this.state;
        return (


          <View style={styles.container}>

<View>
  <Text>Bezier Line Chart</Text>
  <LineChart
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
          
        }
      ]
    }}
    width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel="$"
    yAxisSuffix="k"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
</View>

        
      </View>
      
        )}
}
    
    const styles = StyleSheet.create({
      container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
      singleHead: { width: 80, height: 40, backgroundColor: '#c8e1ff' },
      head: { flex: 1, backgroundColor: '#c8e1ff' },
      title: { flex: 2, backgroundColor: '#f6f8fa' },
      titleText: { marginRight: 6, textAlign:'right' },
      text: { textAlign: 'center' },
      btn: { width: 58, height: 18, marginLeft: 15, backgroundColor: '#c8e1ff', borderRadius: 2 },
      btnText: { textAlign: 'center' }
    });