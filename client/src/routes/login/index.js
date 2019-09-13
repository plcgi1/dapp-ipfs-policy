import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import { asyncSign, asyncCoinBase } from '../../helpers/getWeb3';
import { login } from '../../services/auth'
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';

export default class Login extends Component {
  handleLogin = async () => {
    const { web3 } = this.props

    try {
      const publicAddress = await asyncCoinBase(web3)
      if (!publicAddress) {
        window.alert('Please activate MetaMask first.');
        return;
      }
      let user = await login({ publicAddress })
      
      let signature
      try {
        signature = await asyncSign(
          web3,
          {
            data: `I am signing my one-time nonce: ${user.nonce}`,
            publicAddress,
            // MetaMask will ignore the password argument here
            password: ''
          }
        );
    
        console.info('signature', signature)
      } catch (err) {
        throw new Error('You need to sign the message to be able to log in.', err);
      }
      user = await login({ publicAddress, signature })
      
      this.props.onLogged(user)
      console.info('sdf', user)
    } catch (error) {
      // TODO add process with 400 response with bad signature
      console.error('EEEE', error)
    }
  }
  
  render() {
    const style = {}

    return (
      <div class={`${style.home} page`}>
        <Card>
          <div class={style.cardHeader}>
            <h2 class="mdc-typography--title">Login card</h2>
          </div>
          <Card.Actions>
            <Card.ActionButton onClick={this.handleLogin.bind(this)}>Login with Metamask</Card.ActionButton>
          </Card.Actions>
        </Card>
      </div>
    );
  }
}