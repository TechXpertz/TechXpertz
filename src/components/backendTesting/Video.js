import React, { useState, useEffect } from 'react';
import { useAuth0 } from "../../react-auth0-spa";
import io from "socket.io-client";
import querySearch from "stringquery";

const Video = (props) => {

  const { RTCPeerConnection, RTCSessionDescription } = window;

  const [socket, setSocket] = useState();
  const endpoint = "http://localhost:5000/video";
  const bookingId = querySearch(props.location.search).booking_id;
  const otherBookingId = querySearch(props.location.search).other;
  const peerConnection = new RTCPeerConnection();

  navigator.getUserMedia(
    { video: true, audio: true },
    stream => {
      const localVideo = document.getElementById("local-video");
      if (localVideo) {
        localVideo.srcObject = stream;
      }
    },
    error => {
      console.warn(error.message);
    }
  );

  const { getTokenSilently, loading } = useAuth0();

  async function callUser() {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }

  useEffect(() => {

    try {

      if (!loading) {
        // getTokenSilently().then(tokenRes => {
        //   const socket = io.connect(endpoint, {
        //     query: {
        //       bookingId,
        //     },
        //     transportOptions: {
        //       polling: {
        //         extraHeaders: {
        //           'Authorization': `Bearer ${tokenRes}`
        //         }
        //       }
        //     }
        //   });

        const socket = io.connect(endpoint);
        setSocket(socket);

        callUser().then(offer => {
          socket.emit('call-user', {
            offer
          });
        });

        socket.on('error', error => {
          console.log('error', error);
          // redirect user out of the room
        });

        socket.on('message', (msg) => {
          console.log(msg);
        });

        socket.on('call-made', async (data) => {
          console.log('receive call');
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

          socket.emit("make-answer", {
            answer,
            to: data.socket
          });
        });

        socket.on('answer-made', async (data) => {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        });
      }

    } catch (err) {
      console.log(err);
    }

  }, [loading]);


  return (
    <>
      <button>Start call</button>
      <div classNane="video-container">
        <video autoPlay className="remote-video" id="remote-video"></video>
        <video autoPlay muted className="local-video" id="local-video"></video>
      </div>
    </>
  )


}

export default Video;