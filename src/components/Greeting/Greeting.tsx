import { useState } from "react";
import "./Greeting.scss";

interface IGreeting {
  setStartCannon: any;
  setPlayer: any;
}

function Greeting({ setStartCannon, setPlayer }: IGreeting) {
  const [guest, setGuest] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const nameInput = target.elements.namedItem("name") as HTMLInputElement;

    // Getting the value of the input
    const userName = nameInput.value;

    if (userName !== "") {
      setGuest(userName);
      setPlayer(userName);
      nameInput.value = "";
      setStartCannon(true);
    } else {
      setGuest(``);
    }
  };

  return (
    <>
        <h1 className="home__hello">
          Hello&nbsp;
          <span className="home__hello-name">{guest ? guest : "World"}</span>!
        </h1>
        {!guest && (
          <form className="home__form" onSubmit={handleSubmit}>
            <label className="home__form-label" htmlFor="name">
              What is your name?
            </label>
            <input
              className="home__form-input"
              type="text"
              name="name"
              id="name"
              placeholder="Name up to 15 characters"
              maxLength={15}
            />
            <button
              className="home__form-button"
              type="submit"
              data-label="Enter"
            >
              Enter
            </button>
          </form>
        )}
        {guest && (
          <p className="home__message">
            Welcome to the Bubble Game!
            <span>
              Before you start, check out the current top 3 standings
              (scoreboard). I challenge you to obtain 1rst place! Click on the
              cannon to start the game.
            </span>
          </p>
        )}
    </>
  );
}

export default Greeting;
