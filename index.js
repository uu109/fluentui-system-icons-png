const path = require('path')
const fs = require('fs')

const globby = require('globby');
const svgRecolor = require('nuskin/bin/cmds/recolor');
const sharp = require('sharp');

const output = 'dist';
const svgFilePath = 'fluentui-system-icons/assets/*/SVG/*.svg';
const newColor = '#ff0000';
const newSize = 64;

(async () => {
    fs.mkdirSync('dist' , { recursive: true })

    for await (const filePath of globby.stream(svgFilePath)) {
        const outputPath = path.resolve(output, path.basename(filePath))

        // copy svg files to output
        fs.copyFileSync(filePath, outputPath)

        // change svg fill color
        svgRecolor({ path: outputPath, color: newColor, attr: 'fill' })

        // save as png files
        await sharp(outputPath)
            .resize(newSize)
            .png()
            .toFile(outputPath.replace('.svg', '.png'));

        // delete svg files in dist
        fs.rmSync(outputPath)
    }
})();
