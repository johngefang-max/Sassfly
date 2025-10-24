# Vercel 部署环境变量配置

## 必需的环境变量

### 应用基础配置
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

### 数据库配置 (使用 Neon PostgreSQL)
```
POSTGRES_URL=postgresql://neondb_owner:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-xxx.us-east-1.aws.neon.tech
POSTGRES_PASSWORD=your-password
POSTGRES_DATABASE=neondb
POSTGRES_PRISMA_URL=postgresql://neondb_owner:password@ep-xxx.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
```

### Google OAuth 配置
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### GitHub OAuth 配置 (可选)
```
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 其他配置
```
IS_DEBUG=false  # 生产环境设为 false
```

## Vercel 配置步骤

1. 在 Vercel 项目设置中添加上述环境变量
2. 确保 Google Cloud Console 中的 OAuth 设置包含：
   - 授权的重定向 URI: `https://your-domain.vercel.app/api/auth/callback/google`
3. 确保数据库连接字符串正确且可访问

## 部署检查清单

- [ ] 所有环境变量已添加到 Vercel
- [ ] Google OAuth 回调 URL 已更新
- [ ] 数据库连接正常
- [ ] NEXTAUTH_SECRET 已生成（使用 `openssl rand -base64 32`）
- [ ] 应用 URL 正确配置