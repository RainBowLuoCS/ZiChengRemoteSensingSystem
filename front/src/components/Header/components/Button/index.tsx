import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Form from '../Form'
import SvgIcon from '../../../SvgIcon'
import avatar from '../../../../assets/imgs/avatar.png'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { buttonStyles } from './styles'
import { useShowDialgue } from '../../hooks/useShowDialogue'
import { getToken, clearToken } from '../../../../utils/token'
import { Typography } from '@mui/material'
import { getUserData } from '../../../../network/user/getUserData'
import { useShowDropDown } from './hooks/useShowDropdown'

function _Button() {
  const { showDialogue, setShowDialogue } = useShowDialgue()
  const { showDropDown, setShowDropDown } = useShowDropDown()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [userAccount, setUserAccount] = useState('')

  let token = getToken()

  useEffect(() => {
    token = getToken()
    getUserData().then((res) => {
      setUserAccount(res.data.name)
    })
  }, [token])

  function clickToLogout() {
    setShowDropDown(false)
    clearToken()

    if (pathname === '/home' || pathname === '/recent' || pathname === 'bin') {
      location.reload()
    } else {
      navigate('/home')
    }
  }

  return (
    <>
      <Box
        sx={buttonStyles.button}
        style={{ display: token === null ? 'flex' : 'none' }}
      >
        <span onClick={() => setShowDialogue(true)}>登录</span>
        <Form showDialogue={showDialogue} setShowDialogue={setShowDialogue} />
      </Box>
      <Box>
        <Avatar
          alt="default avatar"
          src={avatar}
          sx={{
            height: '40px',
            width: '40px',
            display: token !== null ? 'block' : 'none',
            marginLeft: '1rem',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setShowDropDown(!showDropDown)
          }}
        />
        <Box
          sx={buttonStyles.dropdown}
          style={{ display: showDropDown ? 'flex' : 'none' }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginBottom: '10px'
            }}
          >
            <Avatar
              alt="default avatar"
              src={avatar}
              sx={{
                height: '40px',
                width: '40px',
                display: token !== null ? 'block' : 'none',
                marginLeft: '1rem',
                cursor: 'pointer'
              }}
            />
            <Typography ml="10px" fontSize="20px" color="secondary.main">
              {userAccount}
            </Typography>
          </Box>
          <Typography
            fontWeight={600}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              clickToLogout()
            }}
          >
            <SvgIcon name="exit" />
            退出登录
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default _Button
