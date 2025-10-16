import { NextRequest, NextResponse } from 'next/server';

// 根据语言获取默认描述文本
function getDefaultDescription(language: string = 'en'): string {
  const descriptions: Record<string, string> = {
    'zh': '请描述一下这个图片',
    'en': 'Please describe this image',
    'es': 'Por favor describe esta imagen',
    'fr': 'Veuillez décrire cette image',
    'de': 'Bitte beschreiben Sie dieses Bild',
    'ja': 'この画像を説明してください'
  };
  
  return descriptions[language] || descriptions['en'];
}

export async function POST(request: NextRequest) {
  console.log('=== Image-to-Prompt API 开始处理请求 ===');
  
  try {
    const { image, promptType, userQuery, language } = await request.json();
    console.log('请求参数:', {
      hasImage: !!image,
      imageLength: image ? image.length : 0,
      promptType,
      userQuery,
      language
    });

    if (!image) {
      console.error('错误: 缺少图片数据');
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Coze API 配置
    const COZE_API_URL = 'https://api.coze.cn/v1/workflow/stream_run';
    const COZE_TOKEN = process.env.COZE_API_KEY;
    const WORKFLOW_ID = '7560912044870942739';

    // 检查环境变量
    if (!COZE_TOKEN) {
      console.error('错误: COZE_API_KEY 环境变量未设置');
      return NextResponse.json(
        { error: 'COZE_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    console.log('Coze API 配置:', {
      url: COZE_API_URL,
      workflowId: WORKFLOW_ID,
      hasToken: !!COZE_TOKEN
    });

    // 验证并限定promptType参数
    const validPromptTypes = ['normal', 'midjourney', 'flux', 'stableDiffusion'];
    const validatedPromptType = validPromptTypes.includes(promptType) ? promptType : 'normal';
    
    console.log('PromptType 验证:', {
      original: promptType,
      validated: validatedPromptType,
      validTypes: validPromptTypes
    });

    // 处理图片数据 - 先上传文件获取file_id
    let fileId: string;
    
    try {
      // 将base64转换为Buffer
      let base64Data = image;
      if (image.startsWith('data:image/')) {
        const base64Index = image.indexOf(',');
        if (base64Index !== -1) {
          base64Data = image.substring(base64Index + 1);
        }
      }
      
      const imageBuffer = Buffer.from(base64Data, 'base64');
      console.log('图片数据处理:', {
        originalLength: image.length,
        bufferLength: imageBuffer.length,
        hasPrefix: image.startsWith('data:image/')
      });

      // 上传文件到Coze
      console.log('正在上传图片文件到 Coze...');
      const formData = new FormData();
      const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
      formData.append('file', blob, 'image.jpg');

      const uploadResponse = await fetch('https://api.coze.cn/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COZE_TOKEN}`,
        },
        body: formData,
      });

      console.log('文件上传响应状态:', uploadResponse.status);
      console.log('文件上传响应头:', Object.fromEntries(uploadResponse.headers.entries()));

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('文件上传失败:', errorText);
        throw new Error(`文件上传失败: ${uploadResponse.status} ${errorText}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('文件上传结果:', uploadResult);
      
      if (uploadResult.code !== 0) {
        throw new Error(`文件上传失败: ${uploadResult.msg}`);
      }
      
      fileId = uploadResult.data.id;
      console.log('获取到文件ID:', fileId);

    } catch (uploadError) {
      console.error('文件上传过程出错:', uploadError);
      return NextResponse.json(
        { 
          success: false, 
          error: '文件上传失败',
          details: uploadError instanceof Error ? uploadError.message : String(uploadError),
          type: 'upload_error'
        },
        { status: 500 }
      );
    }

    const requestBody = {
      workflow_id: WORKFLOW_ID,
      parameters: {
        userQuery: userQuery || getDefaultDescription(language),
        img: JSON.stringify({ file_id: fileId }), // 使用file_id格式
        promptType: validatedPromptType,
      },
    };

    console.log('发送到 Coze API 的请求体:', {
      workflow_id: requestBody.workflow_id,
      parameters: {
        userQuery: requestBody.parameters.userQuery,
        promptType: requestBody.parameters.promptType,
        img: requestBody.parameters.img
      }
    });

    // 调用 Coze API
    console.log('正在调用 Coze API...');
    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Coze API 响应状态:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Coze API 错误响应:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      return NextResponse.json(
        { error: `Coze API 调用失败: ${response.status} ${response.statusText}`, details: errorText },
        { status: 500 }
      );
    }

    // 处理流式响应
    console.log('开始处理流式响应...');
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('错误: 无法获取响应体读取器');
      return NextResponse.json(
        { error: 'No response body' },
        { status: 500 }
      );
    }

    let result = '';
    let fullContent = '';
    let chunkCount = 0;
    let validJsonCount = 0;
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('流式响应读取完成');
          break;
        }

        chunkCount++;
        const chunk = decoder.decode(value);
        console.log(`接收到第 ${chunkCount} 个数据块:`, chunk.substring(0, 200) + (chunk.length > 200 ? '...' : ''));
        
        const lines = chunk.split('\n');
        console.log(`数据块包含 ${lines.length} 行`);

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine) {
            // 检查是否是 SSE 格式的 data 行
            if (trimmedLine.startsWith('data: ')) {
              const jsonStr = trimmedLine.substring(6); // 移除 "data: " 前缀
              try {
                const data = JSON.parse(jsonStr);
                validJsonCount++;
                console.log(`解析到有效 JSON (第 ${validJsonCount} 个):`, {
                  node_is_finish: data.node_is_finish,
                  hasContent: !!data.content,
                  contentType: typeof data.content,
                  contentPreview: typeof data.content === 'string' ? data.content.substring(0, 100) : data.content
                });
                
                // 检查是否是结束节点且包含内容
                if (data.node_is_finish === true && data.content) {
                  console.log('发现结束节点，处理内容...');
                  if (typeof data.content === 'string') {
                    try {
                      // 尝试解析content字符串为JSON对象
                      const contentObj = JSON.parse(data.content);
                      console.log('成功解析 content 为 JSON 对象:', contentObj);
                      if (contentObj.output) {
                        fullContent = contentObj.output;
                        console.log('提取到 output 内容:', fullContent.substring(0, 200) + (fullContent.length > 200 ? '...' : ''));
                      }
                    } catch (e) {
                      // 如果解析失败，直接使用content字符串
                      console.log('content 不是 JSON，直接使用字符串内容');
                      fullContent = data.content;
                    }
                  } else if (typeof data.content === 'object' && data.content.output) {
                    // 如果content已经是对象，直接提取output
                    console.log('content 已经是对象，直接提取 output');
                    fullContent = data.content.output;
                  }
                }
                
                // 收集其他内容作为备用
                if (data.content && typeof data.content === 'string' && !data.node_is_finish) {
                  result += data.content;
                  console.log('累积中间内容，当前长度:', result.length);
                }
              } catch (e) {
                console.log('跳过无效 JSON 数据行:', jsonStr.substring(0, 100));
                continue;
              }
            } else if (trimmedLine.startsWith('id: ') || trimmedLine.startsWith('event: ')) {
              // 跳过 SSE 的 id 和 event 行
              console.log('跳过 SSE 元数据行:', trimmedLine);
            } else {
              // 尝试直接解析为 JSON（兼容性处理）
              try {
                const data = JSON.parse(trimmedLine);
                validJsonCount++;
                console.log('解析到直接 JSON 数据:', data);
                // 处理逻辑同上...
              } catch (e) {
                console.log('跳过无法解析的行:', trimmedLine.substring(0, 100));
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      console.log('释放读取器锁');
    }

    console.log('流式响应处理完成，统计信息:', {
      totalChunks: chunkCount,
      validJsonCount: validJsonCount,
      fullContentLength: fullContent.length,
      resultLength: result.length
    });

    // 优先使用完整内容，否则使用累积的结果
    const finalResult = fullContent || result || 'Generated prompt will appear here';
    console.log('最终结果:', {
      source: fullContent ? 'fullContent' : (result ? 'result' : 'default'),
      length: finalResult.length,
      preview: finalResult.substring(0, 200) + (finalResult.length > 200 ? '...' : '')
    });

    return NextResponse.json({
      success: true,
      prompt: finalResult
    });

  } catch (error) {
    console.error('=== API 发生严重错误 ===');
    const errorType = error instanceof Error ? error.constructor.name : typeof error;
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string')
        ? (error as any).message
        : '未知错误';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('错误类型:', errorType);
    console.error('错误消息:', errorMessage);
    console.error('错误堆栈:', errorStack);
    console.error('完整错误对象:', error);
    console.error('=== 错误信息结束 ===');
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage,
        type: errorType || '未知类型'
      },
      { status: 500 }
    );
  }
}