import React from 'react';


class App extends React.Component {
  addVote = (id) => () => {
    this.props.store.dispatch({
      type: 'ADD_VOTE',
      data: { id }
    })
  }

  createAnecdote = (event) => {
    event.preventDefault()
    this.props.store.dispatch({
      type: 'CREATE_ANECDOTE',
      data: {text: event.target.newAnecdoteText.value}
    })
    event.target.newAnecdoteText.value = ''

  }
  

  render() {
    const anecdotes = this.props.store.getState()
    return (
      <div>
        <h2>Anecdotes</h2>
        {anecdotes.map(anecdote=>
          <div key={anecdote.id}>
            <div>
              {anecdote.content} 
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={this.addVote(anecdote.id)} >vote</button>
            </div>
          </div>
        )}
        <h2>create new</h2>
        <form onSubmit={this.createAnecdote}>
          <div><input name="newAnecdoteText"/></div>
          <button>create</button> 
        </form>
      </div>
    )
  }
}

export default App