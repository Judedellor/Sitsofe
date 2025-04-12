import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const DataAnalyticsScreen = () => {
  // Sample data for charts
  const occupancyRates = [90, 85, 88, 92, 87, 91, 89];
  const rentalIncome = [5000, 5200, 5100, 5300, 5250, 5400, 5350];
  const maintenanceCosts = [200, 250, 220, 210, 230, 240, 225];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Analytics</Text>

      <Text style={styles.chartTitle}>Occupancy Rates</Text>
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              data: occupancyRates,
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
      />

      <Text style={styles.chartTitle}>Rental Income</Text>
      <BarChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              data: rentalIncome,
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
      />

      <Text style={styles.chartTitle}>Maintenance Costs</Text>
      <PieChart
        data={[
          {
            name: 'Jan',
            population: maintenanceCosts[0],
            color: 'rgba(131, 167, 234, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Feb',
            population: maintenanceCosts[1],
            color: '#F00',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Mar',
            population: maintenanceCosts[2],
            color: 'red',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Apr',
            population: maintenanceCosts[3],
            color: '#ffffff',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'May',
            population: maintenanceCosts[4],
            color: 'rgb(0, 0, 255)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Jun',
            population: maintenanceCosts[5],
            color: 'rgb(0, 255, 0)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Jul',
            population: maintenanceCosts[6],
            color: 'rgb(255, 0, 0)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
        ]}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
});

export default DataAnalyticsScreen;
