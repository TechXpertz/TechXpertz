import React, { useState, useEffect } from 'react';
import { useAuth0 } from '../../react-auth0-spa';
import io from 'socket.io-client';
import querySearch from 'stringquery';
import './InterviewRoom.css';

const Video = props => {
  console.log(props.bookingId);
  console.log(props.otherBookingId);
  const { RTCPeerConnection, RTCSessionDescription } = window;
  const endpoint = '/video';
  //TODO bookingID and otherBookingID
  const bookingId = props.bookingId;
  const otherBookingId = props.otherBookingId;

  // DOM elements
  const localVideo = document.getElementById('local-video');
  const remoteVideo = document.getElementById('remote-video');
  const videoContainer = document.getElementById('video-container');

  // variables
  const mediaConstraints = {
    video: true,
    audio: true
  };
  let localStream;
  let remoteStream;
  let peerConnection;
  let isCalling = false;

  // free STUN servers
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  };

  const { getTokenSilently, loading } = useAuth0();

  useEffect(() => {
    try {
      if (!loading) {
        getTokenSilently().then(tokenRes => {
          const socket = io.connect(endpoint, {
            query: {
              bookingId
            },
            transportOptions: {
              polling: {
                extraHeaders: {
                  Authorization: `Bearer ${tokenRes}`
                }
              }
            }
          });

          // socket event callbacks
          socket.on('error', error => {
            console.log('error', error);
            // redirect user out of the room
          });

          socket.on('message', msg => {
            console.log(msg);
          });

          socket.on('join room', () => {
            console.log('joining room');
            socket.emit('any users', {
              bookingId,
              otherBookingId
            });
          });

          socket.on('duplicate users', () => {
            console.log('you are already inside the session!');
            socket.close();
            // alert user and close video
          });

          socket.on('any users response', async data => {
            await setLocalStream(mediaConstraints);
            if (data.hasUser) {
              console.log('sending offer');
              peerConnection = new RTCPeerConnection(iceServers);
              addLocalTracks(peerConnection);
              peerConnection.ontrack = setRemoteStream;
              peerConnection.onicecandidate = event =>
                sendIceCandidate(event, socket);
              await sendOffer(peerConnection, socket, data.socketId);
            } else {
              console.log('waiting for user to join');
            }
          });

          socket.on('receive offer', async data => {
            console.log('receive offer');
            peerConnection = new RTCPeerConnection(iceServers);
            addLocalTracks(peerConnection);
            peerConnection.ontrack = event => setRemoteStream(event);
            peerConnection.onicecandidate = event =>
              sendIceCandidate(event, socket);
            peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );
            await sendAnswer(peerConnection, socket, data.from);
            console.log('sending answer');
          });

          socket.on('receive answer', data => {
            console.log('received answer');
            peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
            if (!isCalling) {
              sendOffer(peerConnection, socket, data.from);
              isCalling = true;
            }
          });

          socket.on('receive ice candidate', data => {
            console.log('receive ice candidate');
            const candidate = new RTCIceCandidate({
              sdpMLineIndex: data.label,
              candidate: data.candidate
            });
            peerConnection.addIceCandidate(candidate);
          });

          socket.on('user disconnected', () => {
            console.log('other user disconnected');
            hideVideoConference();
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [loading]);

  // functions

  const hideVideoConference = () => {
    remoteVideo.srcObject = null;
  };

  const setLocalStream = async mediaConstraints => {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    } catch (error) {
      console.log(error);
    }
    localStream = stream;
    localVideo.srcObject = stream;
  };

  const addLocalTracks = peerConnection => {
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
  };

  const sendOffer = async (peerConnection, socket, to) => {
    let offer;
    try {
      offer = await peerConnection.createOffer();
      peerConnection.setLocalDescription(offer);
    } catch (error) {
      console.log(error);
    }
    socket.emit('send offer', {
      offer,
      to
    });
  };

  const sendAnswer = async (peerConnection, socket, to) => {
    let answer;
    try {
      answer = await peerConnection.createAnswer();
      peerConnection.setLocalDescription(answer);
    } catch (error) {
      console.log(error);
    }

    socket.emit('send answer', {
      answer,
      to
    });
  };

  const setRemoteStream = event => {
    remoteVideo.srcObject = event.streams[0];
    remoteStream = event.stream;
  };

  const sendIceCandidate = (event, socket) => {
    if (event.candidate) {
      socket.emit('ice candidate', {
        label: event.candidate.sdpMLineIndex,
        candidate: event.candidate.candidate
      });
    }
  };

  return (
    <>
      <div className='video-container' id='video-container'>
        <video autoPlay className='remote-video' id='remote-video'></video>
        <video autoPlay muted className='local-video' id='local-video'></video>
      </div>
    </>
  );
};

export default Video;
