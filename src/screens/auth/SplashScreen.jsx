import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
// import { useAppContext } from '../../context/appContext';
import {AuthGraph} from '../../layouts/graphs';
import LottieView from 'lottie-react-native';
import {colors} from '../../constants';
import {useAppContext} from '../../context/appContext';

const {width, height} = Dimensions.get('window');
const SplashScreen = ({navigation}) => {
  const animationRef = useRef(null);
  const {authState} = useAppContext();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: AuthGraph.LoginScreen}],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const loopAnimation = () => {
      animationRef.current?.play(0, 60);
      setTimeout(loopAnimation, 1000);
    };

    loopAnimation();

    return () => clearTimeout();
  }, []);
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'relative',
          justifyContent: 'center',
          backgroundColor: colors.white,
        }}>
        <LottieView
          ref={animationRef}
          source={require('../../assets/animations/shipbear.json')}
          autoPlay={true}
          loop={true}
          style={styles.lottieView}
        />

        <Text style={styles.text}>GreenZone Express</Text>
      </View>
    </View>
  );
};

export default SplashScreen;

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
    color: colors.primary,
    position: 'absolute',
    bottom: 10,
    fontFamily: 'FrederickatheGreat-Regular',
    textAlign: 'center',
    alignSelf: 'center',
  },
  lottieView: {
    width: 350,
    height: 350,
  },
});
