/** 表单相关类型 */

export type ConfigOpts = {
  // 字段的默认值
  default?: string
  /**
   * 对字段的检验函数
   * @param value 此字段现在的值
   * @returns 若检验成功则返回 undefined, 否则返回对应的提示信息
   */
  validator: (value: string) => boolean
}

export type FormConfig = { [name: string]: ConfigOpts }
