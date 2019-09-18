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
    fetching: false
  }

  async componentDidMount () {
    const model = new MetadataModel()

    this.setState({ model })

    const form = model.get()
    if (form) {
      model.setSchema(form)
    }
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
            this.setState({ fetching: false })
            return notification.error({
              message: e.message
            })
          })
      })
    }
  }
  
  render () {
    const { model, fetching } = this.state

    return model
        ? <div className='public'>
        <Layout>
          <Header>
            <ContractView />
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