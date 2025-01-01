import './App.scss'
import { useEffect, useState } from "react";
import { Bubble, IScore } from "./utils/utils";
import CannonImage from "./assets/icons/cannon.svg";
import axios from "axios";
import io from "socket.io-client";
import Greeting from "./components/Greeting/Greeting";

function App() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [counterVisible, setCounterVisible] = useState(false);
  const [bubblesCollected, setBubblesCollected] = useState(0);
  const [startCannon, setStartCannon] = useState(false);
  let counter = bubbles.length;
  const [player, setPlayer] = useState("");
  const [scores, setScores] = useState<IScore[] | null>(null);
  const [countdown, setCountdown] = useState(30); // 30 seconds
  const [timeActive, setTimeActive] = useState(false);

  const socket = io("wss://mu-port-api.onrender.com/?key=muportapikey", {
    transports: ["websocket"],
    secure: true,
  });

  useEffect(() => {
    socket.on("scores", (data) => {
      if (data) {
        setScores(data);
      }
    });

    return () => {
      socket.off("scores");
    };
  }, []);

  useEffect(() => {
    let timer:number;

    if (timeActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevTime) => prevTime - 1);
      }, 1000); // update every second
    }

    if (countdown === 0) {
      setTimeActive(false);
      setCountdown(30);
      setBubblesCollected(0);
      const addPlayer = async () => {
        await axios.post(
          "https://mu-port-api.onrender.com/scores?key=muportapikey",
          {
            name: player,
            score: bubblesCollected,
          }
        );
      };
      addPlayer();
    }

    return () => clearInterval(timer); // cleanup timer on conponent unmount or active changes
  }, [timeActive, countdown]);

  const popped = (bub:Bubble) => {
    bub.visible = false;
    setBubblesCollected(bubblesCollected + 1);
  };

  function addBubbles() {
    counter = counter + 1;
    const newBubble = new Bubble(counter);

    if (bubbles.length === 0) {
      const newArray = [newBubble];
      setBubbles(newArray);
      setCounterVisible(true);
    } else {
      setBubbles([...bubbles, newBubble]);
    }
  }

  function getPlace(position:string) {
    switch (position) {
      case "1":
        return "1rst:";
      case "2":
        return "2nd:";
      case "3":
        return "3rd:";
      default:
        break;
    }
  }

  return (
    <>      
      <main className="home">
        {startCannon && (
          <ul className="home__scores">
            {scores && scores.length > 0
              ? scores?.map((s, index) => {
                  return (
                    <li className="home__scores-player player" key={index}>
                      <span className="player__position">
                        {getPlace(s.position)}
                      </span>
                      <span className="player__name">"{s.name}" @ </span>
                      <span className="player__score">{s.score}</span>
                    </li>
                  );
                })
              : "Loading..."}
          </ul>
        )}
        <div className="home__content-container">
        <Greeting setStartCannon={setStartCannon} setPlayer={setPlayer} />
          {startCannon && (
            <>
              <img
                className="home__cannon"
                src={CannonImage}
                alt="cannon icon image"
                onClick={() => {
                  setTimeActive(true);
                  addBubbles();
                }}
              />
              <h3 className="home__try-me">Try Me!</h3>
              {counterVisible && (
                <div className="home__bubble-counter">
                  <h3>Bubbles Popped: {bubblesCollected}</h3>
                  <h3>Time: {countdown}</h3>
                </div>
              )}
              {timeActive &&
                bubbles !== undefined &&
                bubbles.map((bub, index) => {
                  return (
                    <div
                      className={`home__bubble-start ${bub.visible}`}
                      onClick={() => popped(bub)}
                      key={index}
                    ></div>
                  );
                })}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default App
