import { useState } from 'react'
import { ConfigOpts } from '../../../../../types/user/ConfigOpts'

export function useForm<T extends { [name: string]: ConfigOpts }>(config: T) {
  // 表单
  type Form = { [K in keyof T]: string }
  // 表单检验结果
  type FormHint = { [K in keyof T]?: boolean }

  // 得到表单的初始值
  const initForm: Form = Object.keys(config).reduce((prev, key: keyof T) => {
    // 若传入了默认值则使用之, 否则设置为空串
    prev[key] = config[key].default || ''
    return prev
  }, {} as Form)

  // 调用真正的 react hook 得到响应式的表单数据, 之所以叫 _setForm 是因为后面还要做一层封装
  const [form, _setForm] = useState(initForm)
  // 调用 react hook 得到响应式的表单检验情况数据, 默认为都通过
  const [formIsValidate, setFormValidate] = useState<FormHint>({})

  /**
   * 修改表单的部分字段
   * @param partOfNewForm {字段: 值}, 只改变传入参数中包含的字段
   */
  function setForm(partOfNewForm: Partial<Form>) {
    const newForm: Form = { ...form, ...partOfNewForm }
    _setForm(newForm)
  }

  /**
   * 检查表单的部分(或全部)字段
   * @param keysToCheck 传入多个参数作为需要检验的字段, 若不传参数则检查所有字段
   */
  function doValidate(...keysToCheck: (keyof T)[]) {
    // rest参数 把keysToCheck转换成了数组
    if (keysToCheck.length === 0) {
      // 如果不传入参数则检查所有字段
      keysToCheck = Object.keys(config)
    }
    const newIsValidate = { ...formIsValidate }
    keysToCheck.forEach(
      // 使用传入的 validator 检查你想检查的字段并更新 formIsValidate 的值
      (key) => (newIsValidate[key] = config[key].validator(form[key]))
    )
    setFormValidate(newIsValidate)
  }

  return { form, setForm, formIsValidate, doValidate }
}
