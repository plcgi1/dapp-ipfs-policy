import { Component } from 'preact';
import { Router } from 'preact-router';
import { getWeb3 } from '../helpers/getWeb3';
import Header from './header'
import NotFound from '../routes/not-found';
import Files from '../routes/files';
import Login from '../routes/login';

export default class App extends Component {
	state = {
		loadingWeb3: false,
		currentUrl: '/',
		web3: null,
		user: null
	}
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.setState({
			currentUrl: e.url
		});
	};
	
	componentDidMount () {
		this.setupIpfs()
		this.setupWeb3()
	}
	
	setupIpfs () {}
	
	async setupWeb3 () {
		this.setState({ loadingWeb3: true });
		try {
			const web3 = await getWeb3()
			if (!web3) {
				// TODO show notification with error - install Metamasj what the holy crap
				// impossible to work
				return;
			}
			
			this.setState({ loadingWeb3: false, web3 })
		} catch (error) {
			// TODO notification with error
			// impossible to work
			this.setState({ loadingWeb3: false })
		}
	}
	
	onLogged (user) {
		this.setState({ user })
	}

	render() {
		const { web3, user } = this.state
		return (
			<div id="app">
				{ user ? <Header selectedRoute={this.state.currentUrl} /> : null }
				<Router onChange={this.handleRoute}>
					<Login path="/" web3={web3} onLogged={this.onLogged.bind(this)}/>
					<Files path="/files" user={user} />
					<NotFound default />
				</Router>
			</div>
		);
	}
}
// import LinearProgress from 'preact-material-components/LinearProgress';
// import PolicyForm from './policy-form'
// import Metadata from '../models/metadata';
// import IPFS from 'ipfs-mini';
// import getWeb3 from '../helpers/getWeb3';
// import Toolbar from './header';
// // TODO add save to localstorage with statuses != published
// // TODO investigate cloudflare/ipns - and change infura
// // TODO add network view
// // TODO add feedback from ipns with snackbar
//
// export default class App extends Component {
// 	state = {
// 		saving: false,
// 		loadingWeb3: false,
//     networkName: 'Init unknown'
// 	}
//
// 	componentDidCatch(error) {
// 		console.error('App.error', error)
// 		// TODO add snackbar error
// 		this.setState({ saving: false });
// 	}
//
// 	componentDidMount () {
// 		this.setupIpfs()
// 		this.setupWeb3()
//
// 		// TODO setup contract
// 		// TODO setup jwt
// 	}
//
// 	async setupWeb3 () {
//     this.setState({ loadingWeb3: true });
//
//     const results = await getWeb3
// 		let web3 = results.web3;
// 		if (!web3) {
// 			return this.setState({
// 				loadingWeb3: false,
// 				network: "Unknown.web3 undefined",
// 				web3: null
// 			});
// 		}
//
// 		try {
// 			let networkName;
// 			const networkId = await web3.version.getNetwork()
// 			console.info('networkId', networkId)
// 			switch (networkId) {
// 				case "1":
// 					networkName = "Main";
// 					break;
// 				case "2":
// 					networkName = "Morden";
// 					break;
// 				case "3":
// 					networkName = "Ropsten";
// 					break;
// 				case "4":
// 					networkName = "Rinkeby";
// 					break;
// 				case "42":
// 					networkName = "Kovan";
// 					break;
// 				case "999":
// 					networkName = "Truffle local";
// 					break;
// 				default:
// 					networkName = "Unknown";
// 			}
//
// 			this.setState({
// 				loadingWeb3: false,
// 				web3: web3,
// 				networkName: networkName
// 			});
// 		} catch (error) {
//       this.setState({loadingWeb3: false});
//
// 		}
// 	}
//
//   setupIpfs () {
//     // const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
//     const ipfs = new IPFS({});
//
//     this.setState({ipfs: ipfs});
// 	}
//
// 	async onSave (filledModel) {
// 		this.setState({ saving: true })
// 		try {
// 	   	const result = await Metadata.save(filledModel, this.state.ipfs)
//
// 			console.info('data', result)
//       this.setState({ saving: false })
// 		} catch (error) {
// 			console.error('App.error', error.message)
//
//       this.setState({ saving: false })
// 		}
//     // this.props.ipfs.addJSON(data, (err, hash) => {
//     //   if (err) {
//     //     this.setState({savingText: false});
//     //     return this.props.addNotification(err.message, "error");
//     //   }
// 		//
//     //   console.log("Saved to IPFS", data);
//     //   console.log("IPFS hash:", hash);
// 		//
//     //   this.props.hashStoreContractInstance.save(hash, {value: this.state.price, gas: 200000}).then((result) => {
//     //     /* if(result.receipt.status !== "0x1"){ // can be used after byzantium to check status
//     //        throw new Error("Transaction failed");
//     //     } */
// 		//
//     //     this.setState({savingText: false});
//     //     console.log('Data saved successfully, Tx:', result.tx);
//     //     let log = result.logs[0];
//     //     let hashId = log.args._hashId.toNumber();
//     //     this.props.addNotification(`Data saved successfully ! Submission ID: ${hashId}`, "success");
//     //     this.props.onSubmit(hashId);
//     //   }).catch((err) => {
//     //     this.setState({savingText: false});
//     //     this.props.addNotification(err.message, "error");
//     //   });
//     // });
// 	}
//
// 	render() {
// 		const { saving, loadingWeb3, networkName } = this.state
// 		return (
// 			<div id="app">
// 				<Toolbar />
//         <PolicyForm disabled={saving} model={Metadata.schema} onsave={e => this.onSave(e)}/>
// 			</div>
// 		);
// 	}
// }
