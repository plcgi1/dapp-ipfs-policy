import { h, Component } from 'preact';
import { route, Link } from 'preact-router';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Button from 'preact-material-components/Button';

export default class Header extends Component {
  render(props) {
    /*
    * if props.user - show buttons: logout, add file
    * else - show button: link to login
    * */
    return <LayoutGrid order={12}>
      <LayoutGrid.Inner>
        <LayoutGrid.Cell cols="10"></LayoutGrid.Cell>
        <LayoutGrid.Cell cols="2">
          {
            props.user
              ? <span>
                <Button outlined><Link href='/files/file/new'>Add file</Link></Button>
                <Button><Link href='/logout'>Logout</Link></Button>
              </span>
              : <Button><Link href='/login'>Login</Link></Button>
          }

        </LayoutGrid.Cell>
      </LayoutGrid.Inner>
    </LayoutGrid>
    // return (
    //   <div>
    //     <TopAppBar className="topappbar">
    //       <TopAppBar.Row>
    //         <TopAppBar.Section align-start>
    //           <TopAppBar.Icon menu onClick={this.openDrawer}>
    //             menu
    //           </TopAppBar.Icon>
    //           <TopAppBar.Title>Preact app</TopAppBar.Title>
    //         </TopAppBar.Section>
    //         <TopAppBar.Section align-end shrink-to-fit onClick={this.openSettings}>
    //           <TopAppBar.Icon>settings</TopAppBar.Icon>
    //         </TopAppBar.Section>
    //       </TopAppBar.Row>
    //     </TopAppBar>
    //     <Drawer modal ref={this.drawerRef}>
    //       <Drawer.DrawerContent>
    //         <Drawer.DrawerItem selected={props.selectedRoute === '/'} onClick={this.goHome}>
    //           <List.ItemGraphic>home</List.ItemGraphic>
    //           Home
    //         </Drawer.DrawerItem>
    //         <Drawer.DrawerItem selected={props.selectedRoute === '/profile'} onClick={this.goToMyProfile}>
    //           <List.ItemGraphic>account_circle</List.ItemGraphic>
    //           Profile
    //         </Drawer.DrawerItem>
    //       </Drawer.DrawerContent>
    //     </Drawer>
    //   </div>
    // );
  }
}