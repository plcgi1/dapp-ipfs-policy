import React from 'react';
import PropTypes from 'prop-types'

class ContractView extends React.Component {
  render () {
    return <div>Contract-view</div>
  }
}

ContractView.propTypes = {
  name: PropTypes.string,
  symbol: PropTypes.string,
  address: PropTypes.string
}

export default ContractView
