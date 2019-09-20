import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import PolicyForm from '../../../components/policy-form'
import Metadata from '../../../models/metadata';

export default class File extends Component {
  state = {
    file: null,
    saving: false
  }
  componentDidMount () {
    const { cid } = this.props
    // skip editing - create new
    if (cid === 'new') return

    console.info('Getting file from server or from ipfs...')
    // TODO get file by cid from server or from ipfs
  }

  async onSave (filledModel) {
    this.setState({ saving: true })
    try {
	   	const result = await Metadata.save(filledModel)

			console.info('data', result)
      this.setState({ saving: false })
		} catch (error) {
			console.error('App.error', error.message)

      this.setState({ saving: false })
		}
  }

  render() {
    const { file, saving } = this.state
    const { user } = this.props
    return (
      <div class={`page`}>
        <h1>File</h1>
        <Card>
          <div>
            <PolicyForm disabled={saving} model={Metadata.schema} onsave={e => this.onSave(e)}/>
          </div>
        </Card>
      </div>
    );
  }
}