import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, FlatList, View, TouchableOpacity, Dimensions, Animated, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Get screen dimensions for responsiveness
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const [numbersCalled, setNumbersCalled] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [previousNumber, setPreviousNumber] = useState<number | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const generateNumber = () => {
    if (numbersCalled.length === 90) {
      alert('All numbers have been called!');
      return;
    }

    let newNumber;
    do {
      newNumber = Math.floor(Math.random() * 90) + 1;
    } while (numbersCalled.includes(newNumber));
    setPreviousNumber(currentNumber);
    setNumbersCalled((prev) => [...prev, newNumber]);
    setCurrentNumber(newNumber);
  };

  const currentNumberAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentNumber !== null) {
      Animated.spring(currentNumberAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        currentNumberAnim.setValue(0);
      });
    }
  }, [currentNumber]);

  const restartGame = () => {
    setNumbersCalled([]);
    setCurrentNumber(null);
    setPreviousNumber(null);
  };

  const handleNumberPress = (number: number) => {
    if (number === selectedNumber) {
      setClickCount(clickCount + 1);
      if (clickCount + 1 === 3) {
        if (!numbersCalled.includes(number)) {
          setNumbersCalled((prev) => [...prev, number]);
          setPreviousNumber(currentNumber);
          setCurrentNumber(number);
        }
        setClickCount(0);
        setSelectedNumber(null);
      }
    } else {
      setSelectedNumber(number);
      setClickCount(1);
    }
  };

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
      >
        <Text style={styles.numberText}>{number}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <Image
          source={require('@/assets/images/bg.avif')}
          style={[StyleSheet.absoluteFillObject, { width: screenWidth, height: screenHeight }]}
          resizeMode="cover"
        />

        <ThemedText style={styles.title}>Tambola</ThemedText>

        <ThemedView style={styles.gameContainer}>
          <View style={styles.numberDisplayContainer}>
            <Animated.Text
              style={[
                styles.previousNumber,
                {
                  transform: [
                    {
                      scale: currentNumberAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {previousNumber ? previousNumber : '0'}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.currentNumber,
                {
                  transform: [
                    {
                      scale: currentNumberAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {currentNumber ? currentNumber : '0'}
            </Animated.Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={generateNumber}>
            <Text style={styles.buttonText}>{!currentNumber ? 'Start' : 'Pick Next Number'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.restartButton]} onPress={restartGame}>
            <Text style={styles.buttonText}>Restart Game</Text>
          </TouchableOpacity>

          <ThemedText type="subtitle" style={styles.subTitle}>
            Numbers Called ({numbersCalled.length}/90)
          </ThemedText>

          <FlatList
            data={Array.from({ length: 90 }, (_, i) => i + 1)}
            keyExtractor={(item) => item.toString()}
            numColumns={10}
            renderItem={({ item }) => renderNumber(item)}
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
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
    fontSize: screenWidth * 0.09,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: screenHeight * 0.02,
  },
  gameContainer: {
    gap: 8,
    padding: screenWidth * 0.05,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  numberDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenHeight * 0.02,
  },
  currentNumber: {
    fontSize: screenWidth * 0.15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#ff6347',
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.02,
    borderRadius: 10,
    marginLeft: screenWidth * 0.02,
  },
  previousNumber: {
    fontSize: screenWidth * 0.1,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#00CED1',
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.01,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#1E90FF',
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
  restartButton: {
    backgroundColor: '#FF6347',
  },
  subTitle: {
    marginTop: screenHeight * 0.02,
    fontSize: screenWidth * 0.05,
    fontWeight: '600',
  },
  numberBox: {
    width: screenWidth * 0.068,
    height: screenWidth * 0.069,
    justifyContent: 'center',
    alignItems: 'center',
    margin: screenWidth * 0.01,
    backgroundColor: '#ADD8E6',
    borderRadius: 5,
  },
  calledNumber: {
    backgroundColor: '#FFD700',
  },
  numberText: {
    fontSize: screenWidth * 0.04,
  },
});
