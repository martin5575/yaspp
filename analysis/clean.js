const fs = require('fs');
const path = require('path');

const folderPath = './data';

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const data = JSON.parse(fs.readFileSync(filePath));
        if (data?.length === 0) {
            fs.unlinkSync(filePath);
            console.log('Deleted empty file:', filePath);
        } else {
            // format json
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        }

    });
});