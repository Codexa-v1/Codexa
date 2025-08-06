import { useState } from 'react'
import gitHub from './../assets/image.png'
import './../frontend/css/App.css'

function App() {
  const [statement, setStatement] = useState("Not clicked yet...")

  return (
    <>
      <div>
        <a href="https://github.com/Givenmak-7/Codexa.git" target="_blank">
          <img src={gitHub} className="logo github" alt="Github logo" />
        </a>
      </div>
      <h1>This is... a page. Yes.</h1>
      <div className="card">
        <button onClick={() => setStatement((statement) => statement = "You cliked this. Congratulations.")}>
          {statement}
        </button>
      </div>
      <p className="read-the-docs">
        Click on the GitHub logo to go to our repo.
      </p>
    </>
  )
}

export default App
