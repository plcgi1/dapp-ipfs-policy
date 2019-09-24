import React from 'react';
import Layout from 'antd/lib/layout';
import notification from 'antd/lib/notification'
import ContractView from './components/contract-view'
import PolicyForm from './components/policy-form'
import MetadataModel from './models/metadata'
import { status } from './helpers/enums'
import "antd/dist/antd.css";

const { Content, Sider } = Layout;

class App extends React.Component {
  state = {
    model: null,
    fetching: false,
    account: null
  }

  async componentDidMount () {
    const model = new MetadataModel()
    
    try {
      model.initIpfs()
  
      await model.initWeb3()
  
      await model.initContract()
  
      const form = model.get()
  
      if (form) {
        model.setSchema(form)
      }
      const account = model.getAccountId()
  
      this.setState({model, account})
    } catch (error) {
      console.error('App.componentDidMount', error)
      return notification.error({
        message: error.message
      })
    }
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

        if (!values.status && model.schema.properties.status.value === status.approved.id) {
          values.status = status.approved.id
        }
        model.save({ ...values })
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
    
    if (!model) {
      return <div>Initializing</div>
    }
    
    const tokenInfo = model.getTokenInfo()
    const cid = model.schema.cid

    return <div className='public'>
        <Layout>
          <Sider theme='light' width={'20%'}>
            <ContractView
              tokenManagerAddress={tokenInfo.tokenManagerAddress}
              contractAddress={tokenInfo.contractAddress}
              name={tokenInfo.name}
              symbol={tokenInfo.symbol}
              cid={cid}
              balanceOf={model.balanceOf}
              account={account}/>
          </Sider>
          <Content>
            <PolicyForm
              model={model}
              fetching={fetching}
              onSubmit={this.onSubmit.bind(this)}/>
          </Content>
        </Layout>
      </div>
  }
}

export default App;