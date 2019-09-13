import { Component } from 'preact';
import { Link } from 'preact-router';
import Card from 'preact-material-components/Card';
import List from 'preact-material-components/List';
import style from './style';

export default class Files extends Component {
  state = {
    data: [{
      cid: '12312312312312312',
      name: 'name1.json'
    }],
    count: 0
  }
  componentDidMount () {
    // TODO go to server - get files list
  }

  render() {
    const { data } = this.state
    const { user } = this.props
    return (
      <div class={`${style.home} page`}>
        <h1>My policy list</h1>
        <Card>
          <div class={style.cardBody}>
            <List>
              {
                data.map(row => {
                  return <List.Item>
                    <List.ItemGraphic>folder</List.ItemGraphic>
                    <List.TextContainer>
                      <List.PrimaryText>{ row.cid }</List.PrimaryText>
                      <List.SecondaryText>Feb 9, 2014</List.SecondaryText>
                    </List.TextContainer>
                    { user
                      ? <List.ItemMeta>
                        <Link href={`/files/file/${row.cid}`}>edit</Link>
                      </List.ItemMeta>
                      : null
                    }
                  </List.Item>
                })
              }
            </List>
          </div>
        </Card>
      </div>
    );
  }
}