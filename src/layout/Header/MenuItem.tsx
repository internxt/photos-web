import './MenuItem.scss';

interface MenuItemProps {
    icon: string,
    name: string,
    clickHandler?: any
}

const MenuItem = (props: MenuItemProps) => {
  console.log('MenuItem rendered')
  return (
    <div className="MenuItem" onClick={props.clickHandler} style={{
      backgroundImage: `url(${props.icon})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }}>
    </div>
  );
};

export default MenuItem;