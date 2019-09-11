import { Fragment, Component } from 'preact';
import Snackbar from 'preact-material-components/Snackbar';

export default class MySnackbar extends Component {
  open (message, level) {
    this.bar.MDComponent.show({
      message: `${level}.${message}`
    });
  }
  render(){
    return (
      <Fragment>
        <Snackbar ref={bar=>{this.bar=bar;}}/>
      </Fragment>
    );
  }
}