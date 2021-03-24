import { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Dropdown from 'react-bootstrap/Dropdown'
import ProgressBar from 'react-bootstrap/ProgressBar'
import account from '../../assets/images/Dashboard-Icons/Account.svg'
import logo from '../../assets/images/drive-logo.svg'
import './header.scss';
import search from '../../assets/images/Dashboard-Icons/Search.svg'
import uploadFileIcon from '../../assets/images/Dashboard-Icons/Upload.svg'
import deleteFile from '../../assets/images/Dashboard-Icons/Delete.svg'
import share from '../../assets/images/Dashboard-Icons/Share.svg'
import { getHeaders } from '../../lib/utils/auth'
import Settings from '../../lib/utils/settings'
import MenuItem from './MenuItem'
import { useHistory } from 'react-router'
import customPrettySize from '../../lib/utils/customPrettySize'

interface NavigationBarProps {
  showFileButtons?: boolean,
  showSettingsButton?: boolean,
  setSearchFunction?: any,
  uploadFile?: any,
  createFolder?: any,
  deleteItems?: any,
  shareItem?: any,
  uploadHandler?: any,
  showTeamSettings?: any,
  handleChangeWorkspace?: any,
  isAdmin?: boolean,
  isMember?: boolean
}

interface NavigationBarState {
  workspace?: string,
  menuButton?: any,
  barLimit?: number,
  barUsage?: number,
  isAdmin?: boolean,
  isMember?: boolean
}

const Header = (props: NavigationBarProps & NavigationBarState) => {
  const [menuButton, setMenuButton] = useState(null)
  const [items, setItems] = useState<JSX.Element>()
  const [workspace, setWorkspace] = useState('My workspace')
  const [barLimit, setBarLimit] = useState(1024 * 1024 * 1024 * 2)
  const [barUsage, setBarUsage] = useState(0)
  const [isMember, setIsMember] = useState(props.isMember || false)
  const [isAdmin, setIsAdmin] = useState(props.isAdmin || false)
  const [user, setUser] = useState<any>()
  const [xTeam, setxTeam] = useState()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)

  const getUsage = async (isTeam: Boolean = false) => {
    const headers = await getHeaders(true, false, isTeam)

    const limit = await fetch(`${process.env.REACT_APP_API_URL}/api/limit/`, {
      headers: headers
    }).then(res => res.json()).catch(() => null);

    const usage = await fetch(`${process.env.REACT_APP_API_URL}/api/usage/`, {
      headers: headers
    }).then(res => res.json()).catch(() => null);

    if (limit && usage) {
      setBarUsage(usage.total)
      setBarLimit(limit.maxSpaceBytes)
    }
  }

  const handleChangeWorkspace = () => {
    props.handleChangeWorkspace && props.handleChangeWorkspace()
  }

  const downloadDriveDesktop = () => {
    function getOperatingSystem() {
      let operatingSystem = 'Not known';

      if (window.navigator.appVersion.indexOf('Win') !== -1) { operatingSystem = 'WindowsOS'; }
      if (window.navigator.appVersion.indexOf('Mac') !== -1) { operatingSystem = 'MacOS'; }
      if (window.navigator.appVersion.indexOf('X11') !== -1) { operatingSystem = 'UNIXOS'; }
      if (window.navigator.appVersion.indexOf('Linux') !== -1) { operatingSystem = 'LinuxOS'; }

      return operatingSystem;
    }

    switch (getOperatingSystem()) {
      case 'WindowsOS':
        window.location.href = 'https://internxt.com/downloads/drive.exe';
        break;
      case 'MacOS':
        window.location.href = 'https://internxt.com/downloads/drive.dmg';
        break;
      case 'Linux':
      case 'UNIXOS':
        window.location.href = 'https://internxt.com/downloads/drive.deb';
        break;
      default:
        window.location.href = 'https://internxt.com/downloads/';
        break;
    }
  }

  const getItems = (isTeam: boolean) => {
    const xTeam = Settings.exists('xTeam')

    return (
      <Nav className="m-auto">
        <div className="top-bar">
          <div className="search-container">
            <input alt="Search files" className="search" required style={{ backgroundImage: 'url(' + search + ')' }} onChange={props.setSearchFunction} />
          </div>
        </div>

        <MenuItem icon={uploadFileIcon} name="Upload file" clickHandler={props.uploadFile} />
        <MenuItem icon={deleteFile} name="Delete" clickHandler={props.deleteItems} />
        <MenuItem icon={share} name="Share" clickHandler={props.shareItem} />
        <input id="uploadFileControl" type="file" onChange={props.uploadHandler} multiple={true} />
      </Nav>
    )
  }

  useEffect(() => {
    const xTeam = Settings.exists('xTeam')
    if (xTeam) {
      const admin = Settings.getTeams().isAdmin

      setIsAdmin(!!admin)
    } else setIsAdmin(true)

    try {
      const user = Settings.getUser()
      console.log('user', user)
      if (!user) throw new Error()
      setUser(user)
    } catch {
      history.push('/login')
      return
    }

    if (props.showFileButtons) {
      setItems(getItems(false))
    }

    setIsLoading(false)
  }, [])

  /* useEffect(() => {
    if (props.isTeam !== prevProps.isTeam) {
      setState({
        isTeam: props.isTeam,
        navbarItems: getNavBarItems(props.isTeam),
        workspace: props.isTeam ? 'Team workspace' : 'My workspace'
      }, () => {
        getUsage(props.isTeam);
      });
    }
  }, []) */

  if (isLoading) return <span>Loading</span>

  return (
    <Navbar id="mainNavBar">
      <Navbar.Brand>
        <a href="/"><img src={logo} alt="Logo" /></a>
      </Navbar.Brand>

      <Nav className="m-auto">
        <div className="top-bar">
          <div className="search-container">
            <input alt="Search files" className="search" required style={{ backgroundImage: 'url(' + search + ')' }} onChange={props.setSearchFunction} />
          </div>
        </div>

        <MenuItem icon={uploadFileIcon} name="Upload file" clickHandler={props.uploadFile} />
        <MenuItem icon={deleteFile} name="Delete" clickHandler={props.deleteItems} />
        <MenuItem icon={share} name="Share" clickHandler={props.shareItem} />
        <input id="uploadFileControl" type="file" onChange={props.uploadHandler} multiple={true} />
      </Nav>

      <Nav style={{ margin: '0 13px 0 0' }}>
        <Dropdown drop="left" className="settingsButton">
          <Dropdown.Toggle id="1"><MenuItem icon={account} name="Menu" /></Dropdown.Toggle>

          <Dropdown.Menu>
            <div className="dropdown-menu-group info">
              <p className="name-lastname">{user.name} {user.lastname}</p>
              <ProgressBar className="mini-progress-bar" now={barUsage} max={barLimit} />
              <p className="space-used">Used <strong>{customPrettySize(barUsage)}</strong> of <strong>{customPrettySize(barLimit)}</strong></p>
            </div>

            <Dropdown.Divider />

            <div className="dropdown-menu-group">
              <Dropdown.Item onClick={(e) => { history.push('/storage') }}>Storage</Dropdown.Item>
              {!Settings.exists('xTeam') && <Dropdown.Item onClick={(e) => { history.push('/settings') }}>Settings</Dropdown.Item>}
              <Dropdown.Item onClick={(e) => { history.push('/security') }}>Security</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { history.push('/invite') }}>Referrals</Dropdown.Item>
              {isAdmin || !xTeam ? <Dropdown.Item onClick={(e) => { history.push('/teams'); }}>Teams</Dropdown.Item> : null}
              <Dropdown.Item onClick={(e) => { downloadDriveDesktop() }}>Download</Dropdown.Item>
              <Dropdown.Item href="mailto:support@internxt.zohodesk.eu">Contact</Dropdown.Item>
            </div>

            <Dropdown.Divider />

            <div className="dropdown-menu-group">
              <Dropdown.Item onClick={(e) => {
                /* window.analytics.track('user-signout', {
                  email: getUserData().email
                }) */
                Settings.clear()
                history.push('/login')
              }}>Sign out</Dropdown.Item>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  )
}

export default Header