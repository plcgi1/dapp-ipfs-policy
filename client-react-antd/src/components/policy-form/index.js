import React from 'react';
import PropTypes from 'prop-types'
import Card from 'antd/lib/card';
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import { status } from '../../helpers/enums'

class PolicyForm extends React.Component {
  componentDidMount () {
    console.info('Implement me.PolicyForm.componentDidMount')
  }

  onPublish (e) {
    const { setFieldsValue, getFieldValue } = this.props.form

    setFieldsValue({ status: status.published.id })

    this.props.onSubmit(this.props.form)()
  }

  getFieldComponent (property, disabled) {
    const { model } = this.props
    const schema = model.schema
    const { getFieldDecorator } = this.props.form;

    if (schema.properties[property].fieldType === 'text') {
      return <Form.Item label={property} key={property}>
        {
          getFieldDecorator(property, {
            rules: [
              { required: true }
            ],
            initialValue: schema.properties[property].value
          })(
            <Input
              name={property}
              disabled={schema.cid || disabled}
              placeholder={schema.properties[property].description}
            />
          )
        }
      </Form.Item>
    } else if (schema.properties[property].fieldType === 'select') {
      const statuses = Object
        .keys(status)
        .filter(k => k !== status.published.id)
        .map(s => {
          return status[s]
        })

      return <Form.Item label={property} key={property}>
        {
          getFieldDecorator(property, {
            rules: [
              { required: true }
            ],
            initialValue: schema.properties[property].value
          })(
            <Select
              name={property}
              hintText="Select a status"
              disabled={schema.cid || disabled}
              defaultValue={status.draft.id}
              style={{minWidth: '100%'}}
              box>
              {
                statuses.map(status => {
                  const selected = status.id === schema.properties[property].id

                  return <Select.Option key={status.id} selected={selected}
                    value={status.id}>{status.label}</Select.Option>
                })
              }
            </Select>
          )
        }
      </Form.Item>
    }
  }

  render () {
    const { model, disabled, form, onSubmit } = this.props

    return <Card style={{width: 600, margin: '0 auto'}}>
      <Form layout='vertical' onSubmit={onSubmit(form)}>
        {
          Object.keys(model.schema.properties).map((property) => {
            const component = this.getFieldComponent(property, disabled)

            return component
          })
        }
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button htmlType="submit" size='large' style={{ width: 100 }} type='primary'>Save</Button>

          <Button size='large' onClick={this.onPublish.bind(this)} style={{ width: 100 }}>Mint</Button>
        </Form.Item>
      </Form>
    </Card>
  }
}

PolicyForm.propTypes = {
  model: PropTypes.object,
  onSubmit: PropTypes.func
}

const WrappedForm = Form.create()(PolicyForm);

class FormComponent extends React.Component {
  render () {
    return <WrappedForm {...this.props}/>;
  }
}

export default FormComponent;
