import { Fragment, Component } from 'preact';
import FormField from 'preact-material-components/FormField'
import TextField from 'preact-material-components/TextField'
import { LayoutGridCell, LayoutGrid } from 'preact-material-components/LayoutGrid'
import List from 'preact-material-components/List'
import Button from 'preact-material-components/Button';

export default class PolicyForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      form: {},
      errors: {}
    }
    this.validate = this.validate.bind(this)
    this.onInput = this.onInput.bind(this)
    this.onSave =  this.onSave.bind(this)
    this.onPublish = this.onPublish.bind(this)
  }
  validate (name, value) {
    const { form, errors } = this.state
    if (name) {
      console.info('NN', name, value)
      if (!value) {
        errors[name] = 'Required field'
      } else {
        // delete errors[name]
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
  }

  render() {
    const style = {}
    const { model, disabled } = this.props
    const { form, errors } = this.state
    return (
      <LayoutGrid align='middle'>
           <form class={style['contact2-form']}>
             <LayoutGrid.Inner>
            {
              Object.keys(model.properties).map((property) => {
                const valid = errors[property] ? false : true
console.info('valid', property, name, valid )
                return <div>
                  <TextField
                    style={{width: '100%' }}
                    name={property}
                    label={property}
                    disabled={disabled}
                    value={form[property]}
                    onInput={this.onInput}
                    onChange={this.onInput}
                    valid={valid}
                    helperText={model.properties[property].description}
                  />
                </div>
              })
            }
            </LayoutGrid.Inner>
             <Button onClick={this.onSave} disabled={disabled}>Save</Button>
             <Button onClick={this.onPublish} disabled={disabled}>Publish</Button>
          </form>
        </LayoutGrid>
    );
  }
}