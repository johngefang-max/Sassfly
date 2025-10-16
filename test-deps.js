#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 检查依赖版本一致性...');

try {
  const result = execSync('bun run check-deps', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ 依赖版本检查通过！');
  console.log(result);
} catch (error) {
  console.log('❌ 依赖版本仍有冲突：');
  console.log(error.stdout || error.message);
  process.exit(1);
}

console.log('\n🚀 尝试安装依赖...');

try {
  execSync('bun install', { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log('✅ 依赖安装成功！');
} catch (error) {
  console.log('❌ 依赖安装失败：');
  console.log(error.message);
  process.exit(1);
}

console.log('\n🎉 所有检查通过！项目已准备就绪。');