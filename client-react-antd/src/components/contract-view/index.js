import React from 'react';
import PropTypes from 'prop-types'
import { Statistic, Row, Col, Button } from 'antd';

class ContractView extends React.Component {
  render () {
    const { model } = this.props

    return <Row gutter={16}>
      <Col span={12}>
        <Statistic title="policy URL" value={`${model.schema.cid}`} />
      </Col>
      <Col span={12}>
        <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
        <Button style={{ marginTop: 16 }} type="primary">
          Recharge
        </Button>
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
