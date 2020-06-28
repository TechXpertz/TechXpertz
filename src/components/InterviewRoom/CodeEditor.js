import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import { useAuth0 } from "../../react-auth0-spa";
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import querySearch from "stringquery"
import './InterviewRoom.css'

const CodeEditor = (props) => {

  const [js, setJs] = useState('');
  const [id, setId] = useState('');
  const [socket, setSocket] = useState();

  const { getTokenSilently, loading } = useAuth0();
  const endpoint = "http://localhost:5000";
  const bookingId = querySearch(props.windowLocation.search).booking_id;

  useEffect(() => {

    try {

      if (!loading) {
        getTokenSilently().then(tokenRes => {
          const socket = io.connect(endpoint, {
            query: {
              bookingId,
            },
            transportOptions: {
              polling: {
                extraHeaders: {
                  'Authorization': `Bearer ${tokenRes}`
                }
              }
            }
          });

          setSocket(socket);

          socket.on('error', error => {
            console.log('error', error);
          });

          socket.on('message', (msg) => {
            console.log(msg);
          });

          socket.on('receive code', (payload) => {
            setJs(payload.newCode);
            console.log(payload.newCode);
          })

        });
      }

    } catch (err) {
      console.log(err);
    }

  }, [loading]);

  const codeMirrorOptions = {
    theme: 'material',
    lineNumbers: true,
    scrollbarStyle: null,
    lineWrapping: true,
  };

  const syncCode = (js) => {
    setJs(js);
    socket.emit('code', {
      newCode: js,
    });
  }

  return (
    <div>
      <section className="playground">
        <div className="code-editor js-code" style={{ float: 'right'}}>
          <div className="editor-header">JavaScript</div>
          <CodeMirror
            value={js}
            options={{
              mode: 'javascript',
              ...codeMirrorOptions,
            }}
            onBeforeChange={(editor, data, js) => {
              syncCode(js);
            }}
          />
        </div>
      </section>
    </div>
  );



}

export default CodeEditor;