import React from 'react';
import Layout from 'antd/lib/layout';
import notification from 'antd/lib/notification'
import ContractView from './components/contract-view'
import PolicyForm from './components/policy-form'
import MetadataModel from './models/metadata'
import "antd/dist/antd.css";

const { Header, Content } = Layout;

class App extends React.Component {
  state = {
    model: null,
    fetching: false,
    account: null
  }

  async componentDidMount () {
    const model = new MetadataModel()
    
    model.initIpfs()

    await model.initWeb3()

    model.initContract()

    const form = model.get()

    if (form) {
      model.setSchema(form)
    }
    const account = model.getAccountId()

    this.setState({ model, account })

    console.info('TODO. App.componentDidMount. create ContractInfo props for components')
  }
  
  onSubmit (form) {
    return (e) => {
      if (e) {
        e.preventDefault()
      }
      const { validateFields } = form
      const { model } = this.state

      validateFields((err, values) => {
        if (err) {
          return
        }
        this.setState({ fetching: true })

        model.save(values)
          .then((response) => {
            this.setState({ model: response, fetching: false})

            return notification.info({
              message: 'Data saved'
            })
          })
          .catch((e) => {
            this.setState({ fetching: false, model })

            return notification.error({
              message: e.message
            })
          })
      })
    }
  }
  
  render () {
    const { model, fetching, account } = this.state

    return model
        ? <div className='public'>
        <Layout>
          <Header style={{ background: 'white' }}>
            <ContractView model={model} account={account}/>
          </Header>
          <Content>
            <PolicyForm
              model={model}
              fetching={fetching}
              onSubmit={this.onSubmit.bind(this)}/>
          </Content>
        </Layout>
      </div>
      : <div>Initializing</div>
  }
}

export default App;