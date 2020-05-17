// import React, { Component } from "react";
// import {
//   Button,
//   Dimensions,
//   Picker,
//   SafeAreaView,
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Switch,
// } from "react-native";
// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   ProgressChart,
//   ContributionGraph,
//   StackedBarChart,
// } from "react-native-chart-kit";

// const { width: screenWidth } = Dimensions.get("window");

// export default class Progress extends Component {
//   constructor(props) {
//     super(props);
//   }
//   // const elementButton = (value) => (
//   //     <TouchableOpacity onPress={() => this._alertIndex(value)}>
//   //       <View style={styles.btn}>
//   //         <Text style={styles.btnText}>button</Text>
//   //       </View>
//   //     </TouchableOpacity>
//   //   );

//   //   this.state = {
//   //     tableTitle: ['Title', 'Title2', 'Title3', 'Title4'],
//   //     tableData: [
//   //       [elementButton('1'), 'a', 'b', 'c', 'd'],
//   //       [elementButton('2'), '1', '2', '3', '4'],
//   //       [elementButton('3'), 'a', 'b', 'c', 'd']
//   //     ]
//   //   }
//   // }

//   // _alertIndex(value) {
//   //   Alert.alert(`This is column ${value}`);
//   // }
//   fieldRef = React.createRef();

//   render() {
//     const state = this.state;

//     const data = {
//       labels: ["January", "February", "March", "April", "May", "June"],
//       datasets: [
//         {
//           data: [20, 45, 28, 80, 99, 43]
//         }
//       ]
      
//     };



//     return (
//       <View style={styles.container}>
//         <View>
//           <LineChart
//             data={data}
//             width={screenWidth}
//             height={256}
//             verticalLabelRotation={30}
//             chartConfig={{
//               backgroundColor: "#e26a00",
//               backgroundGradientFrom: "#fb8c00",
//               backgroundGradientTo: "#ffa726",
//               decimalPlaces: 2, // optional, defaults to 2dp
//               color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               style: {
//                 borderRadius: 16,
//               },
//               propsForDots: {
//                 r: "6",
//                 strokeWidth: "2",
//                 stroke: "#ffa726",
//               },
//             }}
//                         bezier
//           />

//           <LineChart
//             data={{
//               labels: [
//                 "January",
//                 "February",
//                 "March",
//                 "April",
//                 "May",
//                 "June",
//                 "July",
//                 "August",
//                 "September",
//                 "October",
//                 "November",
//                 "Decmeber",
//               ],
//               datasets: [
//                 {
//                   data: [
//                     Math.random() * 100,
//                     Math.random() * 100,
//                     Math.random() * 100,
//                     Math.random() * 100,
//                     Math.random() * 100,
//                     Math.random() * 100,
//                   ],
//                 },
//               ],
//             }}
//             width={Dimensions.get("window").width} // from react-native
//             height={220}
//             yAxisLabel="$"
//             yAxisSuffix="k"
//             yAxisInterval={1} // optional, defaults to 1
//             chartConfig={{
//               backgroundColor: "#e26a00",
//               backgroundGradientFrom: "#fb8c00",
//               backgroundGradientTo: "#ffa726",
//               decimalPlaces: 2, // optional, defaults to 2dp
//               color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               style: {
//                 borderRadius: 16,
//               },
//               propsForDots: {
//                 r: "6",
//                 strokeWidth: "2",
//                 stroke: "#ffa726",
//               },
//             }}
//             bezier
//             style={{
//               marginVertical: 8,
//               borderRadius: 16,
//             }}
//           />
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
//   singleHead: { width: 80, height: 40, backgroundColor: "#c8e1ff" },
//   head: { flex: 1, backgroundColor: "#c8e1ff" },
//   title: { flex: 2, backgroundColor: "#f6f8fa" },
//   titleText: { marginRight: 6, textAlign: "right" },
//   text: { textAlign: "center" },
//   btn: {
//     width: 58,
//     height: 18,
//     marginLeft: 15,
//     backgroundColor: "#c8e1ff",
//     borderRadius: 2,
//   },
//   btnText: { textAlign: "center" },
// });


import React from 'react'
import { ScrollView, StatusBar, Dimensions, Text } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from 'react-native-chart-kit'
import { data, contributionData, pieChartData, progressChartData } from './ProgressData'
import 'babel-polyfill'

// in Expo - swipe left to see the following styling, or create your own
const chartConfigs = [
  {
    // backgroundColor: '#000000',
    // Purple
    backgroundGradientFrom: '#8a73ba',
    backgroundGradientTo: '#6c5994',
    // Purple
    color: (opacity = 1) => `rgba(76, 60, 99, ${opacity})`,
    style: {
      borderRadius: 16
    }
  },
  // {
    // backgroundColor: '#022173',
  //   backgroundGradientFrom: '#8a73ba',
  //   backgroundGradientTo: '#6c5994',
  //   color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  //   style: {
  //     borderRadius: 16
  //   }
  // },
  // {
  //   backgroundColor: '#ffffff',
  //   backgroundGradientFrom: '#ffffff',
  //   backgroundGradientTo: '#ffffff',
  //   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
  // },
  // {
  //   backgroundGradientFrom: '#8a73ba',
  //   backgroundGradientTo: '#6c5994',
  //   backgroundGradientTo: '#66bb6a',
  //   color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  //   style: {
  //     borderRadius: 16
  //   }
  // },
  {
    // backgroundColor: '#000000',
    backgroundGradientFrom: '#7d5cab',
    backgroundGradientTo: '#7d5cab',
    color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`
  }, {
    // backgroundColor: '#0091EA',
    backgroundGradientFrom: '#0091EA',
    backgroundGradientTo: '#0091EA',
    color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`
  },
  {
    // backgroundColor: '#e26a00',
    backgroundGradientFrom: '#8a73ba',
    backgroundGradientTo: '#6c5994',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
  },
  {
    // backgroundColor: '#b90602',
    backgroundGradientFrom: '#8a73ba',
    backgroundGradientTo: '#6c5994',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
  },
  {
    // backgroundColor: '#ff3e03',
    backgroundGradientFrom: '#8a73ba',
    backgroundGradientTo: '#6c5994',
    color: (opacity = 1) => `rgba(${0}, ${0}, ${0}, ${opacity})`
  }
]

export default class Progress extends React.Component {
  renderTabBar() {
    return <StatusBar hidden/>
  }
  render() {
    const width = Dimensions.get('window').width
    const height = 220
    return (
      <ScrollableTabView renderTabBar={this.renderTabBar}>
        {chartConfigs.map(chartConfig => {
          const labelStyle = {
            color: "#000000",
            marginVertical: 10,
            textAlign: 'center',
            fontSize: 16
          }
          const graphStyle = {
            marginVertical: 8,
            ...chartConfig.style
          }
          return (
            <ScrollView
              key={Math.random()}
              style={{
                backgroundColor: chartConfig.backgroundColor
              }}
            >
              <Text style={labelStyle}>Routines Complete By Month</Text>
              <LineChart
                data={data}
                width={width}
                height={height}
                chartConfig={chartConfig}
                bezier
                style={graphStyle}
              />
              {/* <Text style={labelStyle}>Contribution Graph</Text> */}
              <ContributionGraph
                values={contributionData}
                width={width}
                height={height}
                endDate={new Date('2016-05-01')}
                numDays={105}
                chartConfig={chartConfig}
                style={graphStyle}
              />
            </ScrollView>
          )
        })}
      </ScrollableTabView>
    )
  }
}