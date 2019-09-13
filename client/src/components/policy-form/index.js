import { Component } from 'preact';
import TextField from 'preact-material-components/TextField'
import LayoutGrid from 'preact-material-components/LayoutGrid'
import Button from 'preact-material-components/Button';
import Select from 'preact-material-components/Select';
import { status } from '../../helpers/enums'

export default class PolicyForm extends Component {
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
  
  validate (name, value) {
    const { form, errors } = this.state
    if (name) {
      if (!value) {
        errors[name] = 'Required field'
      } else {
        delete errors[name]
      }
      return Object.values(errors).length > 0 ? errors : false
    }
    const fieldNames = Object.keys(this.props.model.properties)
    fieldNames.forEach((fieldName) => {
      if (!form[fieldName]) {
        errors[fieldName] = 'Required field'
      } else {
        delete errors[fieldName]
      }
    })

    return Object.values(errors).length > 0 ? errors : false
  }

  onInput (e) {
    const { value, name } = e.target;
    const { state } = this

    state.form[name] = value

    const errors = this.validate(value, name)

    if (errors) {
      state.errors = errors
    }
    this.setState(state)
  }

  onSave (e) {
    e.preventDefault()
    const errors = this.validate()

    if (errors) {
      this.setState({ errors })
      console.warn('ERRORS', errors)
      return null
    }

    this.props.onsave(this.state.form)
  }

  onPublish(e) {
    e.preventDefault()
    // TODO set status published for json
    console.info('onPublish')
    const errors = this.validate()

    if (errors) {
      this.setState({ errors })
      console.warn('ERRORS', errors)
      return null
    }
    this.state.form.status = status.published.id

    this.props.onsave(this.state.form)
  }

  getFieldComponent (name, valid, disabled, form) {
    const { model } = this.props

    if (model.properties[name].fieldType === 'text') {
      return <TextField
        name={name}
        required
        fullwidth
        effect="lineOutwards"
        label={name}
        disabled={disabled}
        value={form[name]}
        onChange={this.onInput}
        valid={valid}
        helperText={model.properties[name].description}
        helperTextPersistent
      />
    } else if (model.properties[name].fieldType === 'select') {
      const statuses = Object
        .keys(status)
        .filter(k => k !== status.published.id)
        .map(s => {
          return status[s]
        })

      return <Select
        name={name}
        hintText="Select a status"
        selectedIndex={0}
        style={{ minWidth: '100%' }}
        onChange={this.onInput}
        valid={valid}
        box>
        {
          statuses.map(status => {
            const selected = status.id === model.properties[name].id

            return <Select.Item selected={selected} value={status.id}>{status.label}</Select.Item>
          })
        }
      </Select>;
    }
  }
  render() {
    const { model, disabled } = this.props
    const { form, errors } = this.state

    return (
      <LayoutGrid align='middle' cols={1}>
        <LayoutGrid.Inner>
          <LayoutGrid.Cell cols="3"></LayoutGrid.Cell>
          <LayoutGrid.Cell cols="6">
           <form>
            {
              Object.keys(model.properties).map((property) => {
                const valid = errors[property] ? false : true
                return this.getFieldComponent(property, valid, disabled, form)
              })
            }
             <Button onClick={this.onSave} disabled={disabled}>Save</Button>
             <Button onClick={this.onPublish} disabled={disabled}>Publish</Button>
          </form>
          </LayoutGrid.Cell>
        </LayoutGrid.Inner>
      </LayoutGrid>
    );
  }
}