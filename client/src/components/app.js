import { Component } from 'preact';
import LinearProgress from 'preact-material-components/LinearProgress';
import Snackbar from 'preact-material-components/Snackbar';
import PolicyForm from './policy-form'
import Metadata from '../models/metadata';
import IPFS from 'ipfs-mini';
import 'preact-material-components/style.css';

// TODO add snackbar component
// TODO add save to localstorage with statuses != published
// TODO investigate cloudflare/ipns - and change infura
// TODO add network view
// TODO add feedback from ipns with snackbar

export default class App extends Component {
	state = {
		saving: false
	}
	
	componentDidCatch(error) {
		console.error('App.error', error)
		// TODO add snackbar error
		this.setState({ saving: false });
	}
	
	componentDidMount () {
		this.setupIpfs()
		this.setupWeb3()
    // this.bar.MDComponent.show({
    //   message: "Hello Snack!"
    // });
		// TODO setup contract
		// TODO setup jwt
	}

	setupWeb3 () {
    // TODO implement me
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
		const { saving } = this.state
		return (
			<div id="app">
				{
					saving ? <LinearProgress indeterminate /> : null
				}
        <h1>Metadata editor</h1>
        <PolicyForm disabled={saving} model={Metadata.model} onsave={e => this.onSave(e)}/>
        <Snackbar dismissesOnAction ref={bar=>{this.bar=bar;}}/>
			</div>
		);
	}
}
