import React from 'react';
import PropTypes from 'prop-types'
import Card from 'antd/lib/card';
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import { status } from '../../helpers/enums'

class PolicyForm extends React.Component {
  onPublish () {
    const { setFieldsValue } = this.props.form

    setFieldsValue({ status: status.published.id })

    this.props.onSubmit(this.props.form)()
  }

  getFieldComponent (property, disabled) {
    const { model } = this.props
    const schema = model.schema
    const { getFieldDecorator } = this.props.form;

    if (schema.properties[property].fieldType === 'text') {
      const re = new RegExp(`${status.approved.id}|${status.published.id}`,"g");
      const disabledByStatus = re.test(schema.properties[property].value)

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
              disabled={disabledByStatus || disabled}
              placeholder={schema.properties[property].description}
            />
          )
        }
      </Form.Item>
    } else if (schema.properties[property].fieldType === 'select') {
      let statuses = []
      if(property === 'status') {
        if(!schema.properties[property].value) {
          statuses.push({ ...status.draft })
          statuses.push({ ...status.approved, disabled: true })
        }
        if (schema.properties[property].value === status.draft.id) {
          statuses.push({ ...status.draft, disabled: true })
          statuses.push({ ...status.approved })
        }
        if (schema.properties[property].value === status.approved.id) {
          statuses.push({ ...status.draft, disabled: true })
          statuses.push({ ...status.approved, disabled: true })
        }
        if(schema.properties[property].value === status.published.id) {
          statuses.push({ ...status.published })
        }
      }

      if (schema.properties.status.value === status.published.id) {
        disabled = true
      }
      return <Form.Item label={property} key={property}>
        {
          getFieldDecorator(property, {
            rules: [
              { required: true }
            ]
          })(
            <Select
              name={property}
              hintText="Select a status"
              disabled={disabled}
              defaultValue={status.draft.id}
              style={{minWidth: '100%'}}
              box>
              {
                statuses.map(status => {
                  const selected = status.id === schema.properties[property].id

                  return <Select.Option
                    disabled={status.disabled}
                    key={status.id}
                    selected={selected}
                    value={status.id}>
                    {status.label}
                  </Select.Option>
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
    const { schema } = model
    const showMinter = true //(schema.properties.status.value === status.approved.id)

    return <Card style={{width: '60%', margin: '0 auto'}}>
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
          <Button
            disabled={schema.properties.status.value === status.approved.id || disabled}
            htmlType="submit"
            size='large'
            style={{ width: 120 }}
            type='primary'>
            Save
          </Button>
          {
            showMinter
              ? <Button
                size='large'
                onClick={this.onPublish.bind(this)}
                style={{ width: 120 }}>
                Mint
              </Button>
              : null
          }
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
