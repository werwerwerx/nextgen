const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  const sourcePath = path.join(__dirname, '../public/images/logo-512.png');
  const outputDir = path.join(__dirname, '../public');

  try {
    // Проверяем существование исходного файла
    await fs.access(sourcePath);
    
    // Создаем все необходимые размеры
    const sizes = [
      { width: 16, height: 16 },
      { width: 32, height: 32 },
      { width: 48, height: 48 },
      { width: 192, height: 192 },
      { width: 180, height: 180 }, // для apple-icon
    ];

    // Генерируем PNG файлы для каждого размера
    for (const size of sizes) {
      const outputName = size.width === 180 
        ? 'apple-icon.png'
        : size.width === 192 
          ? 'icon-192.png'
          : `favicon-${size.width}x${size.height}.png`;

      await sharp(sourcePath)
        .resize(size.width, size.height)
        .png()
        .toFile(path.join(outputDir, outputName));

      console.log(`Generated ${outputName}`);
    }

    // Создаем favicon.ico (включает 16x16, 32x32, 48x48)
    const icoSizes = [16, 32, 48];
    const icoBuffers = await Promise.all(
      icoSizes.map(size => 
        sharp(sourcePath)
          .resize(size, size)
          .toFormat('png')
          .toBuffer()
      )
    );

    // Используем png-to-ico для создания .ico файла
    const toIco = require('png-to-ico');
    const icoBuffer = await toIco(icoBuffers);
    await fs.writeFile(path.join(outputDir, 'favicon.ico'), icoBuffer);
    console.log('Generated favicon.ico');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 