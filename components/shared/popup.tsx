import React, { Component } from 'react';
import { Modal, Image, TouchableHighlight, View, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
const soundObject = new Audio.Sound();




export default function PopupLoader(props) {
    console.log('fewf', props);
    const sound = props.sound;
    return (
        <Modal
            animationType="fade"
            transparent={true}
            // visible={true}
            // presentationStyle="overFullScreen"
            onShow={async () => {
                if (sound) {

                    try {
                        await soundObject.loadAsync(require('../../assets/sound/checkedin.wav'));
                        await soundObject.playAsync();
                        setTimeout(async () => {
                            await soundObject.unloadAsync();
                        }, 1000);
                        // Your sound is playing!
                    } catch (error) {
                        // An error occurred!
                        alert(error);
                    }
                }

            }}>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100%', width: '100%' }}>
                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', marginBottom: 100 }}>
                    {/* <View> */}
                    <Image style={{ width: 50, height: 50 }} source={require('../../assets/loader.gif')} />
                    {/* </View> */}
                </View>
            </View>
        </Modal>
    )
}