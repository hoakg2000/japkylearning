import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Button, ScrollView, FlatList } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // Import icons from Expo vector-icons
import * as Speech from 'expo-speech';

const lettersData = require('../constants/letter.json');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LearningScreen = ({ letterType }) => {
    useEffect(() => {
        getRandomQuestion();
    }, [])
    const key = letterType;
    const [text, setText] = useState(""); // State to hold the text
    const [resultVisible, setResultVisible] = useState(false);
    const [result, setResult] = useState([])
    const [answer, setAnswer] = useState([])
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [chosedAnswer, setChosedAnswer] = useState("");

    const { letters } = lettersData;

    const getRandomLetter = () => {
        const randomIndex = Math.floor(Math.random() * letters.length);
        const randomIndex2 = Math.floor(Math.random() * letters[randomIndex].length);
        return letters[randomIndex][randomIndex2];
    }

    const shuffleList = (list) => {
        const shuffledList = [...list]; // Create a copy of the original list

        for (let i = shuffledList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
            [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]]; // Swap elements at indices i and j
        }

        return shuffledList;
    };
    const getRandomQuestion = () => {
        const chosedQuestion = getRandomLetter();
        let tmp = [chosedQuestion];
        for (let i = 0; i < 4; i++) {
            let newAns;
            do {
                newAns = getRandomLetter();
            } while (tmp.some(ans => ans == newAns))
            tmp.push(newAns)
        }
        setAnswer(shuffleList(tmp));
        setCorrectAnswer(chosedQuestion);
        setChosedAnswer("");
        setText(chosedQuestion[key])
    }

    const handleRevealPressIn = () => {
        setText(correctAnswer.r);
    };

    const handleRevealPressOut = () => {
        setText(correctAnswer[key]);
    };

    const openResult = () => {
        setResultVisible(true)
    }

    const closeResult = () => {
        setResultVisible(false)
    }

    const reset = () => {
        setResult([]);
        getRandomQuestion();
    }

    const handleAnswer = (chose) => {
        if (chosedAnswer == "") {
            setChosedAnswer(chose)
            setResult([...result, { ...correctAnswer, correct: correctAnswer == chose }])
        }
    }


    const nextQuestion = () => {
        if (chosedAnswer)
            getRandomQuestion();
    }

    const handleSpeak = () => {
        Speech.stop();
        Speech.speak(correctAnswer[key], {
            language: 'ja-JP',
            rate: 0.5,
            voice: 'ja-jp-x-jac-network'
        });
    };

    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.card}>
                        <Text style={styles.text}>{text}</Text>
                        <View style={styles.buttonsContainer}>
                            {answer.map(a =>
                                <TouchableOpacity key={"answer" + a.r}
                                    style={[styles.answerButton,
                                    chosedAnswer && correctAnswer == a && styles.correctContainer,
                                    chosedAnswer == a && correctAnswer != a && styles.incorrectContainer]}
                                    onPress={() => handleAnswer(a)}>
                                    <Text>{a.r}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPressIn={handleRevealPressIn}
                                onPressOut={handleRevealPressOut}
                            >
                                <MaterialIcons name="visibility" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleSpeak}>
                                <Ionicons name="volume-high" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.buttonResult} onPress={resultVisible ? closeResult : openResult}>
                            <Text style={styles.buttonText}>Result</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonResult} onPress={reset}>
                            <Text style={styles.buttonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonResult} onPress={nextQuestion}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                    {resultVisible &&
                        <View style={[styles.resultContainer]}>
                            {result.map((result, colIndex) => {
                                const containerStyle = result.correct ? styles.correctContainer : styles.incorrectContainer;
                                return (
                                    <View style={[styles.letter, containerStyle]} key={"col" + colIndex}>
                                        <View key={"col" + colIndex + "jp"} style={styles.firstRow}>
                                            <Text >{result.h}</Text>
                                            <Text >{result.k}</Text>
                                        </View>
                                        <View key={"col" + colIndex + "en"} style={styles.centeredTextContainer}>
                                            <Text >{result.r}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    }
                </View>
            </ScrollView>


        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    card: {
        width: screenWidth * 0.8,
        height: screenHeight * 0.4,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // Add elevation for Android shadow
        shadowColor: '#000000', // Add shadow for iOS shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        fontSize: 24,
        margin: 50
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    button: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
        marginHorizontal: 5, // Add margin to separate buttons
    },
    answerButton: {
        flex: 1, // Take equal space along the row
        height: 40, // Set height
        backgroundColor: 'lightblue',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5, // Add horizontal margin between buttons
    },
    correctContainer: {
        backgroundColor: 'lightgreen',
    },
    incorrectContainer: {
        backgroundColor: '#f45757',
    },
    buttonResult: {
        margin: 50,
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    wrongAnswer: {
        backgroundColor: 'lightred',
    },
    correctAnswer: {
        backgroundColor: 'lightgreen',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cell: {
        margin: 10,
        height: 30,
        justifyContent: 'center',
        color: 'black'
    },
    letter: {
        width: 'auto',
        height: 'auto',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5
    },
    textResult: {
    },
    firstRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    resultContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }

});

export default LearningScreen;
