import React from 'react';
import Layout from 'antd/lib/layout';
import ContractView from './components/contract-view'
import PolicyForm from './components/policy-form'
import MetadataModel from './models/metadata'
import "antd/dist/antd.css";

const { Header, Content } = Layout;

class App extends React.Component {
  state = {
    model: null
  }

  componentDidMount () {
    const model = new MetadataModel()

    this.setState({ model })

    const form = model.get()
    if (form) {
      model.setValues(form)
    }
    console.info('TODO. App.componentDidMount. create onSubmit props for components')
    console.info('TODO. App.componentDidMount. create ContractInfo props for components')
  }

  render () {
    const { model } = this.state

    return model
        ? <div className='public'>
        <Layout>
          <Header>
            <ContractView />
          </Header>
          <Content>
            <PolicyForm model={model}/>
          </Content>
        </Layout>
      </div>
      : <div>Initializing</div>
  }
}

export default App;