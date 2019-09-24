import React from 'react';
import PropTypes from 'prop-types'
import Popover from 'antd/lib/popover';
import List from 'antd/lib/list'
import { contractBaseUrl } from '../../helpers/enums'
import stringShort from '../../helpers/string'

class ContractView extends React.Component {
  render () {
    const { cid, account, contractAddress, tokenManagerAddress, name, symbol, balanceOf } = this.props

    const shortAddr = account ? stringShort(account) : 'Not set yet'
    const shortCid = cid ? stringShort(cid) : 'Not set yet'
    const shortenedContractAddress = contractAddress ? stringShort(contractAddress) : 'Not set yet'
    const shortenedTokenManagerAddress = tokenManagerAddress ? stringShort(tokenManagerAddress) : 'Not set y'
    return <div style={{ margin: 20 }}>
      <List
        itemLayout="horizontal"
      >
        <List.Item>et
          <List.Item.Meta
            title='Current account'
            description={<Popover content={account}>{shortAddr}</Popover>}
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            title='policy CID'
            description={<Popover content={<a target="blank" href={`${contractBaseUrl}/${cid}`}>{cid}</a>}>{shortCid}</Popover>}
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            title='Token contract address'
            description={<Popover content={contractAddress}>{shortenedContractAddress}</Popover>}
          />
        </List.Item>
  
        <List.Item>
          <List.Item.Meta
            title='Token manager contract address'
            description={<Popover content={tokenManagerAddress}>{shortenedTokenManagerAddress}</Popover>}
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
  
        <List.Item>
          <List.Item.Meta
            title='Balance'
            description={balanceOf}
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
