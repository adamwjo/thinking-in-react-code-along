import React, { Component } from 'react'

//Components
import Navbar  from './Navbar'
import PokeContainer from './PokeContainer'
import Home from './Home'

export default class App extends Component {

 

  state = {
    display: "Home",
    searchText: "",
    pokemons: []
  }

  componentDidMount(){
    fetch("http://localhost:3001/pokemon")
      .then(res => res.json())
      .then(pokemons => this.setState({ pokemons }))
  }

  // Takes in a pokemon object and adds a new pokemon to state
  createPokemon = (pokemonObj) => {
    this.setState({pokemons: [pokemonObj, ...this.state.pokemons]})
  }

  // Changes the display to the pokemon container
  changeToPokemon = () => {
    this.setState({display: "Pokemon"})
  }

   // Changes the display to the Home page
  changeToHome = () => {
    this.setState({display: "Home"})
  }

  // Takes in user input from the navbar and sets it to state
  handleSearchText = (data) => {
    this.setState({
      searchText: data
    })
  }

  // Takes in a pokemon and removes it to state 
  deletePokemon = (pokemonObj) => {
    const newPokemons = this.state.pokemons.filter(pokemon=> pokemon.id !== pokemonObj.id)

    fetch(`http://localhost:3001/pokemon/${pokemonObj.id}`, {method: "DELETE"})
      .then(() => this.setState({
        pokemons: newPokemons
      }))
  }

  updatePokemon = (poke) => {

    //Find the pokemon we clicked on in state
    const oldPoke = this.state.pokemons.find(pokemon => poke.id === pokemon.id)

    //We also need the index so we can use it to insert the new object later
    const oldIndex = this.state.pokemons.indexOf(oldPoke)

    // Now lets make a new array that removes the pokemon we clicked on
    const filteredList = this.state.pokemons.filter(pokemon => pokemon.id !== poke.id)

    // Create a new object that we will use to insert into state AND send to the server
    const newPoke = {...oldPoke, weight: +oldPoke.weight + 10}

    // Take the updated pokemon object and inject into the array where we filtered the old one out
    filteredList.splice(oldIndex, 0, newPoke)


    const reqObj = {
      headers: {"Content-Type": "application/json"},
      method: "PATCH",
      body: JSON.stringify(newPoke)
    }

    fetch(`http://localhost:3001/pokemon/${poke.id}`, reqObj)
      .then(r => r.json())
      .then(() => {
        this.setState({
        pokemons: filteredList
      }
    )}
    )
  }


  render(){

   const filteredPokemon = this.state.pokemons.filter(poke => poke.name.includes(this.state.searchText))


    return (
      <div className="bg-dark">
        <Navbar handleSearchText={this.handleSearchText} display={this.state.display} changeToHome={this.changeToHome} />
        { this.state.display === "Home" ? <Home changeToPokemon={this.changeToPokemon}/> : null }
        { this.state.display === "Pokemon" ? <PokeContainer createPokemon={this.createPokemon} deletePokemon={this.deletePokemon} updatePokemon={this.updatePokemon} pokemon={filteredPokemon} /> : null}
      </div>
    )
  }
}



