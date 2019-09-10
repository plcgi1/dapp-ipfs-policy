import style from './style';

const Header = (props) => {
  return <header class={style.header}>
    <h1>{props.title}</h1>
  </header>
};

export default Header;
