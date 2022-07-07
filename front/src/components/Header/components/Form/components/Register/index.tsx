import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useState, useRef } from 'react'
import { formStyles } from '../../styles'
import { useForm } from '../../hooks/useForm'
import { FormConfig } from '../../../../../../types/user/ConfigOpts'
import { register } from '../../../../../../network/user/register'

type Props = {
  showLogin: boolean
  setShowLogin: (val: boolean) => void
  setShowDialogue: (val: boolean) => void
}

const formConfig: FormConfig = {
  account: {
    validator: (s) =>
      /^(?=.*[a-z])(?=.*\d)[a-z]{1}[a-z\d]{3,15}$/.test(s) ? true : false
  },
  password: {
    validator: (s) => (/^[a-zA-Z\d]{8,20}$/.test(s) ? true : false)
  }
}

const color = ['#E46A69', '#908F8E']

export default function Register(props: Props) {
  const { showLogin, setShowLogin, setShowDialogue } = props
  const { form, setForm, formIsValidate, doValidate } = useForm(formConfig)

  const [checkPw, setCheckPw] = useState('')
  const [pwNotSame, setPwNotSame] = useState(false)
  const [hasRegistered, setHasRegistered] = useState(false)

  const formRef = useRef()

  async function clickToRegister(account: string, password: string) {
    if (formIsValidate.account && formIsValidate.password && !pwNotSame) {
      const reqData = {
        account,
        password
      }
      const resData = await register(reqData)

      if (resData.code === 0) {
        alert('注册成功')
        setForm({ account: '', password: '' })
        /*@ts-ignore*/
        formRef.current.reset()
        setShowLogin(true)
        setShowDialogue(false)
      } else if (resData.code === 2004) setHasRegistered(true)
    } else console.log('账号或密码的格式错误，或两次输入的密码不同')
  }

  return (
    <Box
      sx={{
        display: !showLogin ? 'flex' : 'none',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/*@ts-ignore*/}
      <form style={formStyles.form} ref={formRef}>
        <input
          type="text"
          placeholder="输入您的账号"
          /*@ts-ignore*/
          style={formStyles.input}
          className="form_input"
          autoComplete="true"
          onChange={(e) => {
            setForm({ account: e.target.value })
          }}
          onBlur={() => {
            doValidate('account')
          }}
        />
        <Typography
          sx={formStyles.hint}
          margin="5px 0"
          width="95%"
          style={{
            color: formIsValidate.account === false ? color[0] : color[1]
          }}
        >
          账号以字母开头，由小写英文字母和数字组成的4-16位字符
        </Typography>
        <input
          type="password"
          placeholder="输入您的密码"
          /*@ts-ignore*/
          style={formStyles.input}
          className="form_input"
          autoComplete="true"
          onChange={(e) => {
            setForm({ password: e.target.value })
          }}
          onBlur={() => {
            doValidate('password')
          }}
        />
        <Typography
          sx={formStyles.hint}
          margin="5px 0"
          width="95%"
          style={{
            color: formIsValidate.password === false ? color[0] : color[1]
          }}
        >
          长度8-20位，仅可包括数字、大写字母、小写字母
        </Typography>
        <input
          type="password"
          placeholder="确认您的密码"
          /*@ts-ignore*/
          style={formStyles.input}
          className="form_input"
          autoComplete="true"
          onChange={(e) => {
            setCheckPw(e.target.value)
          }}
          onBlur={() => {
            if (checkPw === form.password && checkPw.length !== 0) {
              setPwNotSame(false)
            } else {
              setPwNotSame(true)
            }
          }}
        />
        <Typography
          sx={formStyles.hint}
          margin="5px 0"
          width="95%"
          style={{ color: pwNotSame ? color[0] : color[1] }}
        >
          两次输入的密码不同，请重新确认您的密码
        </Typography>
        <Typography
          sx={formStyles.hint}
          margin="5px 0"
          style={{ color: color[0], display: hasRegistered ? 'block' : 'none' }}
        >
          账号已被注册
        </Typography>
      </form>
      <Button
        variant="contained"
        sx={formStyles.button}
        onClick={() => {
          clickToRegister(form.account, form.password)
        }}
      >
        注册
      </Button>
      <Typography
        display="flex"
        mt="20px"
        fontSize=".9rem"
        color={hasRegistered ? color[0] : color[1]}
      >
        已有账户？
        <span
          style={{
            fontSize: '.9rem',
            color: '#01555A',
            fontWeight: 500,
            cursor: 'pointer'
          }}
          onClick={() => setShowLogin(true)}
        >
          点击登录
        </span>
      </Typography>
    </Box>
  )
}
