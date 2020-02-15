import React, { Component } from 'react';
import { WebView, View, Modal } from 'react-native';
import Popuploader from './popup';
export default class Webview extends Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }

    }

    componentDidMount() {
        console.log('gregre', this.props);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {(this.state.loading) ? <Popuploader></Popuploader> : null}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={true}
                    onRequestClose={() => {
                    }}>
                    <WebView
                        renderLoading={() => <Popuploader></Popuploader>}
                        source={{ uri: this.props.url }}
                        style={{ marginTop: 20 }}
                        javaScriptEnabled={true}
                        onLoadEnd={() => { this.setState({ loading: false }) }}
                        onNavigationStateChange={(navEvent) => {
                            console.log('greherh', navEvent);
                            if (this.props.change) {
                                if (navEvent.url.search(this.props.domain) != -1) {
                                    console.log('payment done');
                                    this.props.paymentDone();
                                }
                            }
                        }}
                    />
                </Modal>
            </View>
        );
    }
}