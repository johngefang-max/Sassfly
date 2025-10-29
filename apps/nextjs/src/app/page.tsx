import { redirect } from 'next/navigation'
import { getCurrentUser } from '@saasfly/auth'
import { headers } from 'next/headers'

export default async function HomePage() {
  const user = await getCurrentUser()
  // 获取用户语言偏好，默认英文
  const headersList = headers()
  const acceptLanguage = headersList.get('accept-language') || ''
  const preferredLang = acceptLanguage.includes('zh') ? 'zh' : 'en'

  // 所有用户都重定向到主页，根据语言偏好选择语言版本
  redirect(`/${preferredLang}`)
}