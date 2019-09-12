import { Component } from 'preact';
import LinearProgress from 'preact-material-components/LinearProgress';
import Snackbar from 'preact-material-components/Snackbar';
import PolicyForm from './policy-form'
import Metadata from '../models/metadata';
import IPFS from 'ipfs-mini';
import getWeb3 from '../helpers/getWeb3'
import 'preact-material-components/style.css';

// TODO add save to localstorage with statuses != published
// TODO investigate cloudflare/ipns - and change infura
// TODO add network view
// TODO add feedback from ipns with snackbar

export default class App extends Component {
	state = {
		saving: false,
		loadingWeb3: false,
    networkName: 'Init unknown'
	}
	
	componentDidCatch(error) {
		console.error('App.error', error)
		// TODO add snackbar error
		this.setState({ saving: false });
	}
	
	componentDidMount () {
		this.setupIpfs()
		this.setupWeb3()

		// TODO setup contract
		// TODO setup jwt
	}

	async setupWeb3 () {
    this.setState({ loadingWeb3: true });

    const results = await getWeb3
		let web3 = results.web3;
		if (!web3) {
			return this.setState({
				loadingWeb3: false,
				network: "Unknown.web3 undefined",
				web3: null
			});
		}

		try {
			let networkName;
			const networkId = await web3.version.getNetwork()
			console.info('networkId', networkId)
			switch (networkId) {
				case "1":
					networkName = "Main";
					break;
				case "2":
					networkName = "Morden";
					break;
				case "3":
					networkName = "Ropsten";
					break;
				case "4":
					networkName = "Rinkeby";
					break;
				case "42":
					networkName = "Kovan";
					break;
				case "999":
					networkName = "Truffle local";
					break;
				default:
					networkName = "Unknown";
			}

			this.setState({
				loadingWeb3: false,
				web3: web3,
				networkName: networkName
			});
		} catch (error) {
      this.setState({loadingWeb3: false});
      this.bar.MDComponent.show({
        message: error.message
      });
		}
	}

  setupIpfs () {
    const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

    this.setState({ipfs: ipfs});
	}

	async onSave (filledModel) {
		this.setState({ saving: true })
		try {
			const cid = await Metadata.save(filledModel, this.state.ipfs)

			console.info('data', cid)
      this.setState({ saving: false })
		} catch (error) {
			console.error('App.error', error.message)
      this.bar.MDComponent.show({
          message: error.message
        });
      this.setState({ saving: false })
		}
    // this.props.ipfs.addJSON(data, (err, hash) => {
    //   if (err) {
    //     this.setState({savingText: false});
    //     return this.props.addNotification(err.message, "error");
    //   }
		//
    //   console.log("Saved to IPFS", data);
    //   console.log("IPFS hash:", hash);
		//
    //   this.props.hashStoreContractInstance.save(hash, {value: this.state.price, gas: 200000}).then((result) => {
    //     /* if(result.receipt.status !== "0x1"){ // can be used after byzantium to check status
    //        throw new Error("Transaction failed");
    //     } */
		//
    //     this.setState({savingText: false});
    //     console.log('Data saved successfully, Tx:', result.tx);
    //     let log = result.logs[0];
    //     let hashId = log.args._hashId.toNumber();
    //     this.props.addNotification(`Data saved successfully ! Submission ID: ${hashId}`, "success");
    //     this.props.onSubmit(hashId);
    //   }).catch((err) => {
    //     this.setState({savingText: false});
    //     this.props.addNotification(err.message, "error");
    //   });
    // });
	}

	render() {
		const { saving, loadingWeb3, networkName } = this.state
		return (
			<div id="app">
				{
					(loadingWeb3 || saving) ? <LinearProgress indeterminate /> : null
				}
        <h1>Metadata editor. Current network: {networkName}</h1>
        <PolicyForm disabled={saving} model={Metadata.model} onsave={e => this.onSave(e)}/>
        <Snackbar dismissesOnAction ref={bar=>{this.bar=bar;}}/>
			</div>
		);
	}
}
