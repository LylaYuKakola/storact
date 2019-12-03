/**
 * @desc 相关id获取
 */

const allChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const replacer = () => allChars[Math.floor(Math.random() * 62)]

const guid = () => 'RANDOM_xxxx'.replace(/[x]/g, replacer)
export default guid
