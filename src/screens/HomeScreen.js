// screens/HomeScreen.js
import React from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

const lettersData = require('../constants/letter.json');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const HomeScreen = () => {
    const { letters } = lettersData;

    const handleTextPress = async (letter) => {
        Speech.stop();
        Speech.speak(letter, {
            language: 'ja-JP',
            rate: 0.5,
            voice: 'ja-jp-x-jac-network'
        });
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                {letters.map((row, rowIndex) => (
                    <View key={"row" + rowIndex} style={styles.row}>
                        {row.map((letter, colIndex) => (
                            <TouchableOpacity style={styles.letter} onPress={() => handleTextPress(letter.h)} key={"col" + colIndex}>
                                <View key={"col" + colIndex + "jp"} style={styles.firstRow}>
                                    <Text style={[styles.text, styles.textFirstRow]}>{letter.h}</Text>
                                    <Text style={[styles.text, styles.textFirstRow]}>{letter.k}</Text>
                                </View>
                                <View key={"col" + colIndex + "en"} style={styles.centeredTextContainer}>
                                    <Text style={[styles.text, styles.centeredText]}>{letter.r}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    row: {
        width: screenWidth * 0.9,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    firstRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textFirstRow: {
        // textAlign: "center"
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
});

export default HomeScreen;