// import React, { useEffect, useState } from 'react';
// import { Controlled as CodeMirror } from 'react-codemirror2';
// import Pusher from 'pusher-js';
// import pushid from 'pushid';
// import axios from 'axios';
// import querySearch from "stringquery";
// import { useAuth0 } from "../../../react-auth0-spa";

// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material.css';

// import 'codemirror/mode/htmlmixed/htmlmixed';
// import 'codemirror/mode/css/css';
// import 'codemirror/mode/javascript/javascript';

// const CodeEditor = (props) => {

//   const [js, setJs] = useState('');
//   const [id, setId] = useState('');

//   const { getTokenSilently, loading } = useAuth0();



//   const pusher = new Pusher("11a4b8ea55ce097fb8fd", {
//     cluster: "ap1",
//     forceTLS: true,
//     authEndpoint: 'http://localhost:5000/editor/auth',
//     auth: {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     }
//   });


//   useEffect(() => {

//     setId(pushid());
//     channel.bind("code-update", data => {
//       if (data.id === id) return;
//       setJs(data.js);
//     });

//   }, []);

//   const syncUpdates = (js) => {

//     const data = { id, js };
//     console.log(data);
//     axios
//       .post("http://localhost:5000/editor/update-editor", data)
//       .catch(console.error);
//   };


//   const codeMirrorOptions = {
//     theme: 'material',
//     lineNumbers: true,
//     scrollbarStyle: null,
//     lineWrapping: true,
//   };

//   return (
//     <div>
//       <section className="playground">
//         <div className="code-editor js-code">
//           <div className="editor-header">JavaScript</div>
//           <CodeMirror
//             value={js}
//             options={{
//               mode: 'javascript',
//               ...codeMirrorOptions,
//             }}
//             onBeforeChange={(editor, data, js) => {
//               setJs(js);
//               syncUpdates(js);
//             }}
//           />
//         </div>
//       </section>
//     </div>
//   );



// }

// export default CodeEditor;