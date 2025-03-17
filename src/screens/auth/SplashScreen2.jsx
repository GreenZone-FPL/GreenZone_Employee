import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { AuthGraph, MainGraph } from '../../layouts/graphs';
import { useAppContext } from '../../context/appContext';

const SplashScreen2 = ({ navigation }) => {
  const { authState } = useAppContext();
  useEffect(() => {
    const timer = setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: MainGraph.graphName }],
        })
      
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SplashScreen2</Text>
    </View>
  );
};

export default SplashScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});
