import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useEffect, useState, useContext } from 'react';
import "../css/style.css";
import axios from "axios";
import { resetToken } from "../utils/APIRoutes";
import { MyContext } from "../ContextApi/remove";

export default function VideoCalling({ stream }) {
  const [call, setCall] = useState(null);

  const apiKey = stream.hash;
  const token = stream.token.token;
  const userId = stream.token.userId;
  const callId = 'Meeting';

  console.log("apiKey", apiKey);
  console.log("Token", token);
  console.log("UserId", userId);
  console.log(typeof userId);

  const user = {
    id: userId,
    name: 'Prince',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
  };

  const client = new StreamVideoClient({ apiKey, token, user });

  useEffect(() => {
    const joinCall = async () => {
      const newCall = client.call('default', callId);
      await newCall.join({ create: true });
      setCall(newCall);
    };
    joinCall();
  }, []);
  if (!call) {
    return (
      <>
        <p>Call is Starting..</p>
        <button>Click To Close</button>
      </>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout/>
      </StreamCall>
    </StreamVideo>
  );
}

export const MyUILayout = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <>
        <p>Loading..</p>
      </>
    );
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};
