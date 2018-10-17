import React from 'react'
import ReactDOM from 'react-dom'
import counterReducer from './reducer'
import {createStore} from 'redux'

const store = createStore(counterReducer)

const Statistiikka = ({onClearClick}) => {  
  const palautteita = store.getState().good+store.getState().ok+store.getState().bad

  if (palautteita === 0) {
    return (
      <div>
        <h2>statistiikka</h2>
        <div>ei yhtään palautetta annettu</div>
      </div>
    )
  }

  return (
    <div>
      <h2>statistiikka</h2>
      <table>
        <tbody>
          <tr>
            <td>hyvä</td>
            <td>{store.getState().good}</td>
          </tr>
          <tr>
            <td>neutraali</td>
            <td>{store.getState().ok}</td>
          </tr>
          <tr>
            <td>huono</td>
            <td>{store.getState().bad}</td>
          </tr>
          <tr>
            <td>keskiarvo</td>
            <td>{((store.getState().bad*(-1)+store.getState().good)/palautteita).toFixed(1)}</td>
          </tr>
          <tr>
            <td>positiivisia</td>
            <td>{(store.getState().good/palautteita*100).toFixed(1)} %</td>
          </tr>
        </tbody>
      </table>

      <button onClick={onClearClick} >nollaa tilasto</button>
    </div >
  )
}

class App extends React.Component {



  klik = (nappi) => () => {
    const action = {
      type: nappi
    }

    store.dispatch(action)
  }

  render() {
    return (
      <div>
        <h2>anna palautetta</h2>
        <button onClick={this.klik('GOOD')}>hyvä</button>
        <button onClick={this.klik('OK')}>neutraali</button>
        <button onClick={this.klik('BAD')}>huono</button>
        <Statistiikka onClearClick={this.klik('ZERO')} />
      </div>
    )
  }
}

const render = () => {
    ReactDOM.render(<App />, document.getElementById('root'));
}

render()
store.subscribe(render)



