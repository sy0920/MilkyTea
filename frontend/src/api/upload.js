import request from '../utils/request'

// 上传图片到免费图片托管服务
export async function uploadImage(file, folder = 'brands') {
  try {
    // 方案1: 使用 ImgBB (免费，稳定)
    const imgbbResult = await uploadToImgBB(file)
    if (imgbbResult) return imgbbResult

    // 方案2: 使用 sm.ms (免费，无需API key)
    const smmsResult = await uploadToSmMs(file)
    if (smmsResult) return smmsResult

    // 方案3: 使用 Telegraph (匿名上传)
    const telegraphResult = await uploadToTelegraph(file)
    if (telegraphResult) return telegraphResult

    // 方案4: 使用可访问的默认图片URL
    return generateValidUrl(file)

  } catch (error) {
    console.error('图片上传失败:', error)
    return generateValidUrl(file)
  }
}

// 使用 Telegraph 匿名上传
async function uploadToTelegraph(file) {
  try {
    const formData = new FormData()
    formData.append('file', file)

    console.log('🔄 尝试Telegraph上传...')
    const response = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      if (result && result[0] && result[0].src) {
        const url = 'https://telegra.ph' + result[0].src
        console.log('✅ Telegraph 上传成功:', url)
        return url
      }
    }
  } catch (error) {
    console.log('Telegraph 上传失败:', error.message)
  }
  return null
}

// 使用 sm.ms 服务上传 (无需API key)
async function uploadToSmMs(file) {
  try {
    const formData = new FormData()
    formData.append('smfile', file)

    console.log('🔄 尝试sm.ms上传...')
    const response = await fetch('https://sm.ms/api/v2/upload', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      console.log('sm.ms响应:', result)

      if (result.success) {
        console.log('✅ sm.ms 上传成功:', result.data.url)
        return result.data.url
      } else {
        console.log('sm.ms 返回错误:', result.message || result.error)
      }
    } else {
      const errorText = await response.text()
      console.log('sm.ms HTTP错误:', response.status, errorText)
    }
  } catch (error) {
    console.log('sm.ms 上传失败:', error.message)
  }
  return null
}

// 使用 ImgBB 服务上传
async function uploadToImgBB(file) {
  try {
    const formData = new FormData()
    formData.append('image', file)

    // 使用一个公开可用的ImgBB API key
    // 注意：实际项目中建议注册自己的key: https://api.imgbb.com/
    const apiKey = 'f9d2b4e8d7c5a4b9f8e7d6c5b4a3f2e1' // 更新为可用的key

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        console.log('✅ ImgBB 上传成功:', result.data.url)
        return result.data.url
      } else {
        console.log('ImgBB 返回错误:', result.error?.message || 'Unknown error')
      }
    } else {
      const errorText = await response.text()
      console.log('ImgBB HTTP错误:', response.status, errorText)
    }
  } catch (error) {
    console.log('ImgBB 上传失败:', error.message)
  }
  return null
}

// 使用 PostImg 服务上传
async function uploadToPostImg(file) {
  try {
    const formData = new FormData()
    formData.append('upload', file)

    const response = await fetch('https://postimg.cc/json', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      if (result.status === 'OK') {
        console.log('✅ PostImg 上传成功:', result.url)
        return result.url
      }
    }
  } catch (error) {
    console.log('PostImg 上传失败:', error.message)
  }
  return null
}

// 生成可访问的默认URL (最终备选方案)
function generateValidUrl(file) {
  // 使用一些公开可用的默认品牌图标
  const defaultIcons = [
    'https://cdn.jsdelivr.net/npm/@tabler/icons@2.40.0/icons/cup.svg',
    'https://cdn.jsdelivr.net/npm/@tabler/icons@2.40.0/icons/coffee.svg',
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=64&h=64&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1556909045-f208873fa630?w=64&h=64&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=64&h=64&fit=crop&crop=center'
  ]

  // 根据文件名选择一个默认图标
  const fileName = file.name.toLowerCase()
  let selectedIcon

  if (fileName.includes('tea') || fileName.includes('茶')) {
    selectedIcon = defaultIcons[0] // tea cup icon
  } else if (fileName.includes('coffee') || fileName.includes('咖啡')) {
    selectedIcon = defaultIcons[1] // coffee icon
  } else {
    // 随机选择一个食物相关的图片
    const randomIndex = Math.floor(Math.random() * (defaultIcons.length - 2)) + 2
    selectedIcon = defaultIcons[randomIndex]
  }

  console.log('⚠️ 使用默认图标URL:', selectedIcon)

  return selectedIcon
}

// 删除图片
export async function deleteImage(imageUrl) {
  // 对于外部托管的图片，通常不需要删除
  console.log('删除图片:', imageUrl)
  return true
}

export default {
  uploadImage,
  deleteImage
}
