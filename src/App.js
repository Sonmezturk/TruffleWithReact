import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery.json';
class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      //const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      // const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = lottery.networks[networkId];
      const instance = new web3.eth.Contract(
        lottery.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // const manager = await instance.methods.manager().call({from: accounts[0]});
      const manager = await instance.methods.manager().call();
      const players = await instance.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(instance.options.address);
      const tr = await web3.utils.fromWei(this.state.balance, 'ether');
      this.setState({tr ,manager, players, balance });
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  onSubmit = async event => {
    //const web3 = await getWeb3();
    event.preventDefault();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = lottery.networks[networkId];
    const instance = new web3.eth.Contract(
      lottery.abi,
      deployedNetwork && deployedNetwork.address,
    );

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await instance.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    //const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = lottery.networks[networkId];
    const instance = new web3.eth.Contract(
      lottery.abi,
      deployedNetwork && deployedNetwork.address,
    );
    this.setState({ message: 'Waiting on transaction success...' });

    await instance.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };




  render() {
    return (
      <div>
        <p>{this.web3}</p>
        <h2> lottery</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently{' '}
          {this.state.players.length} people entered, competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
