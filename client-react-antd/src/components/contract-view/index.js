import React from 'react';
import PropTypes from 'prop-types'
import { Statistic, Row, Col } from 'antd';
import stringShort from '../../helpers/string'

class ContractView extends React.Component {
  render () {
    const { model, name, symbol, account } = this.props

    const shortAddr = account ? stringShort(account) : 'Not set yet'
    const shortCid = model.schema.cid ? stringShort(model.schema.cid) : 'Not set yet'

    return <Row gutter={16}>
      <Col span={6}>
        <Statistic title="Current account" value={shortAddr}/>
      </Col>
      <Col span={6}>
        {/* TODO short link with full link by click */}
        <Statistic title="policy CID" value={shortCid} />
      </Col>
      <Col span={6}>
        <Statistic title="Token name" value={name ? name : 'Not set yet'}/>
      </Col>
      <Col span={6}>
        <Statistic title="Token Symbol" value={symbol ? symbol : 'Not set yet'}/>
      </Col>
    </Row>
  }
}

ContractView.propTypes = {
  name: PropTypes.string,
  symbol: PropTypes.string,
  address: PropTypes.string,
  model: PropTypes.object
}

export default ContractView
