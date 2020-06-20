
const glob = require(`glob`);
const fs = require(`fs`);
const path = require("path");
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const addSizeInfo = (filePath) => {
  const state = fs.statSync(filePath);
  return {
    size: state.size,
    filePath
  }
};


(async () => {
  const matchesThumbnail = glob.sync(`src/images/thumbnail/**/*.{png,jpg,jpeg}`);
  const matchesPage = glob.sync(`src/pages/**/*.{png,jpg,jpeg}`);

  [...matchesThumbnail, ...matchesPage].map(addSizeInfo).forEach(async(factor) => {
    const filePath = factor.filePath;
    const fileDir = path.dirname(filePath)
    const fileExt = path.extname(filePath)

    if(['.png'].includes(fileExt)) {

      await imagemin([filePath], {
        destination: fileDir, // overwrite
        plugins: [
          imageminPngquant()
        ]
      });

      const compressedSize = fs.statSync(filePath).size;    
      console.log(`${factor.size} -> ${compressedSize} ${filePath}`);  

    } else if(['.jpg','.jpeg'].includes(fileExt)){

      await imagemin([filePath], {
        destination: fileDir, // overwrite
        plugins: [
          imageminMozjpeg()
        ]
      });

      const compressedSize = fs.statSync(filePath).size;    
      console.log(`${factor.size} -> ${compressedSize} ${filePath}`);  
    } else {
      console.log("Can't optimize", filePath)
    }
  })
})();