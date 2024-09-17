import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, FlatList, View, TouchableOpacity, Dimensions, Animated, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';

// Get screen dimensions for responsiveness
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const [numbersCalled, setNumbersCalled] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [previousNumber, setPreviousNumber] = useState<number | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [incomingNumbers, setIncomingNumbers] = useState<number[]>([]);

  const generateNumber = () => {
    if (numbersCalled.length === 90) {
      alert('All numbers have been called!');
      return;
    }

    let newNumber;
    do {
      if (incomingNumbers.length !== 0) {
        newNumber = incomingNumbers.shift();
      }
      else newNumber = Math.floor(Math.random() * 90) + 1;
    } while (numbersCalled.includes(newNumber!));
    setPreviousNumber(currentNumber);
    setNumbersCalled((prev) => [...prev, newNumber!]);
    setCurrentNumber(newNumber!);
  };

  const currentNumberAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentNumber !== null) {
      Animated.spring(currentNumberAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 70,      // Adjust this to increase/decrease speed
        bounciness: 0,  // Adjust for how bouncy the animation feels
        // You can also use `friction` and `tension` as alternatives
      }).start(() => {
        currentNumberAnim.setValue(0); // Reset the animation after completion
      });
    }
  }, [currentNumber]);

  const restartGame = () => {
    Alert.alert(
      "Confirm Restart",
      "Are you sure you want to restart the game?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Restart",
          onPress: () => {
            // Reset game state
            setNumbersCalled([]);
            setCurrentNumber(null);
            setPreviousNumber(null);
            setIncomingNumbers([]);
          }
        }
      ]
    );
  };

  const handleNumberPress = (number: number) => {
    if (number === selectedNumber) {
      setClickCount(clickCount + 1);
      if (clickCount + 1 === 3) {
        if (!incomingNumbers.includes(number)) {
          setIncomingNumbers((prev) => [...prev, number]);

          // setNumbersCalled((prev) => [...prev, number]);
          // setPreviousNumber(currentNumber);
          // setCurrentNumber(number);
        }
        setClickCount(0);
        setSelectedNumber(null);
      }
    } else {
      setSelectedNumber(number);
      setClickCount(1);
    }
  };
  console.log(incomingNumbers);

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
        setSelectedNumber(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const renderNumber = (number: number) => {
    const isCalled = numbersCalled.includes(number);
    return (
      <TouchableOpacity
        style={[styles.numberBox, isCalled ? styles.calledNumber : {}]}
        onPress={() => handleNumberPress(number)}
        disabled={isCalled}
        activeOpacity={1}
      >
        <Text style={styles.numberText}>{number}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/BG.png')}
        style={[StyleSheet.absoluteFillObject, { width: screenWidth, height: "auto" }]}
        resizeMode="cover"
      />

      <ThemedText style={styles.title}>Tambola</ThemedText>

      <ThemedView style={styles.gameContainer}>
        {currentNumber &&
          <LinearGradient
            colors={['#0025f4', '#cb1065']} // Start and end colors
            style={styles.button}
          >
            <TouchableOpacity onPress={restartGame}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </LinearGradient>}

        <View style={styles.numberDisplayContainer}>
          <LinearGradient
            style={[
              styles.previousNumber,
            ]}
            colors={['#cb1065', '#3d0b8e']}
          >
            <Text style={[
              styles.previousNumberText,
            ]}       >
              {previousNumber ? previousNumber : ''}
            </Text>
          </LinearGradient>
          <Animated.View style={{
            transform: [
              {
                scale: currentNumberAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.1, 0.9],
                }),
              },
            ],
          }}><LinearGradient
            style={[
              styles.currentNumber,
            ]}
            colors={['#cb1065', '#3d0b8e']}
          // Start and end colors
          >
              <Text
                onPress={generateNumber}
                style={currentNumber ? styles.currentNumberText : styles.startbutton}
              >
                {currentNumber ? currentNumber : 'Start'}
              </Text>
            </LinearGradient></Animated.View>
        </View>
        <FlatList
          data={Array.from({ length: 90 }, (_, i) => i + 1)}
          keyExtractor={(item) => item.toString()}
          numColumns={10}
          renderItem={({ item }) => renderNumber(item)}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    paddingTop: 20,
    fontSize: screenWidth * 0.09,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: screenHeight * 0.02,
  },
  gameContainer: {
    gap: 8,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  numberDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 22,
    // backgroundColor: "red",
    marginBottom: screenHeight * 0.02,
    marginLeft: screenHeight * 0.06,
  },
  currentNumberText: {
    fontSize: screenWidth * 0.15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center'

  },
  previousNumberText: {
    fontSize: screenWidth * 0.1,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  currentNumber: {

    // backgroundColor: '#ff6347',
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.02,
    borderRadius: 10,
    marginLeft: screenWidth * 0.02,
    width: 116,
    height: 116,
    marginStart: 5,
  },
  previousNumber: {
    fontSize: screenWidth * 0.1,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#b3b2b2',
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.01,
    borderRadius: 10,
    width: 80,
    height: 80,
    opacity: 0.5,
    textAlign: 'center'
  },
  button: {
    padding: screenHeight * 0.02,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: screenHeight * 0.02,
  },
  buttonText: {
    fontSize: screenWidth * 0.05,
    color: '#FFF',
    fontWeight: 'bold',
  },
  subTitle: {
    marginTop: screenHeight * 0.02,
    fontSize: screenWidth * 0.05,
    fontWeight: '600',
  },
  numberBox: {
    width: screenWidth * 0.071,
    height: screenWidth * 0.078,
    justifyContent: 'center',
    alignItems: 'center',
    margin: screenWidth * 0.01,
    // backgroundColor: '#ADD8E6',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
  },
  calledNumber: {
    backgroundColor: '#D30957',
  },
  numberText: {
    fontSize: screenWidth * 0.027,
    color: '#ffffff',
  },
  startbutton: {
    color: '#ffffff',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    paddingTop: 20,
  }
});
