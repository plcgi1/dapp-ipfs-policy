import React from 'react';
import PropTypes from 'prop-types'
import Card from 'antd/lib/card';
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import { status } from '../../helpers/enums'

class PolicyForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      form: {},
      errors: {}
    }
    this.validate = this.validate.bind(this)
    this.onInput = this.onInput.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onPublish = this.onPublish.bind(this)
  }

  componentDidMount () {
    console.info('Implement me.PolicyForm.componentDidMount')
  }

  getFieldComponent (name, valid, disabled, form) {
    const { model } = this.props
    const schema = model.schema

    if (schema.properties[name].fieldType === 'text') {
      return <Input
        name={name}
        required
        disabled={schema.cid || disabled}
        value={form[name]}
        onChange={this.onInput}
        placeholder={schema.properties[name].description}
      />
    } else if (schema.properties[name].fieldType === 'select') {
      const statuses = Object
        .keys(status)
        .filter(k => k !== status.published.id)
        .map(s => {
          return status[s]
        })

      return <Select
        name={name}
        hintText="Select a status"
        disabled={schema.cid || disabled}
        defaultValue={status.draft.id}
        style={{ minWidth: '100%' }}
        onChange={this.onInput}
        box>
        {
          statuses.map(status => {
            const selected = status.id === schema.properties[name].id

            return <Select.Option key={status.id} selected={selected} value={status.id}>{status.label}</Select.Option>
          })
        }
      </Select>;
    }
  }

  validate () {
    return false
  }

  onInput (ev) {
    let name
    let value
    if (ev.target) {
      value = ev.target.value;
      name = ev.target.name;
    } else {
      name = 'status'
      value = ev
    }

    const { state } = this

    state.form[name] = value

    const errors = this.validate(value, name)

    if (errors) {
      state.errors = errors
    }
    this.setState(state)
  }

  onSave () {}

  onPublish () {}

  render () {
    const { model, disabled } = this.props
    const { errors, form } = this.state
    const { getFieldDecorator } = this.props.form;

    return <Card style={{width: 600, margin: '0 auto'}}>
      <Form layout='vertical'>
        {
          Object.keys(model.schema.properties).map((property) => {
            const valid = errors[property] ? false : true
            const component = this.getFieldComponent(property, valid, disabled, form)

            return <Form.Item label={property} key={property}>
              {getFieldDecorator(property, {
              rules: [
                { required: true },
              ],
            })( component )}
            </Form.Item>
          })
        }
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button size='large' style={{ width: 100 }} type='primary'>Save</Button>

          <Button size='large' style={{ width: 100 }}>Mint</Button>
        </Form.Item>
      </Form>
    </Card>
  }
}

PolicyForm.propTypes = {
  model: PropTypes.object
}

const WrappedForm = Form.create()(PolicyForm);

class FormComponent extends React.Component {
  render () {
    return <WrappedForm {...this.props}/>;
  }
}

export default FormComponent;
