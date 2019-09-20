import React from 'react';
import PropTypes from 'prop-types'
import Popover from 'antd/lib/popover';
import List from 'antd/lib/list'
import stringShort from '../../helpers/string'

class ContractView extends React.Component {
  render () {
    const { model, account } = this.props

    const shortAddr = account ? stringShort(account) : 'Not set yet'
    const shortCid = model.schema.cid ? stringShort(model.schema.cid) : 'Not set yet'
    const tokenInfo = model.getTokenInfo()
    const shortenedContractAddress = tokenInfo.contractAddress ? stringShort(tokenInfo.contractAddress) : 'Not set yet'
    const name = tokenInfo.name ? tokenInfo.name : 'Not set yet'
    const symbol = tokenInfo.symbol ? tokenInfo.symbol : 'Not set yet'

    return <div style={{ margin: 20 }}>
      <List
        itemLayout="horizontal"
      >
        <List.Item>
          <List.Item.Meta
            title='Current account'
            description={<Popover content={account}>{shortAddr}</Popover>}
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            title='policy CID'
            description={<Popover content={model.schema.cid}>{shortCid}</Popover>}
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            title='Token contract address'
            description={<Popover content={tokenInfo.contractAddress}>{shortenedContractAddress}</Popover>}
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            title='Token name'
            description={name}
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            title='Token symbol'
            description={symbol}
          />
        </List.Item>
      </List>
    </div>
  }
}

ContractView.propTypes = {
  name: PropTypes.string,
  symbol: PropTypes.string,
  address: PropTypes.string,
  model: PropTypes.object
}

export default ContractView
