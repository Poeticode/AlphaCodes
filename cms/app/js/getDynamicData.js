module.exports = function(fs, path) {
    var cms_data = [];

    return new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, '../../../_src/hbs/data/dynamic/'), function(error, filepaths) {
            if (error) return reject(error);

            for (let filepath of filepaths) {
                cms_data.push({
                    'contents': require(path.join(__dirname, '../../../_src/hbs/data/dynamic/',filepath)),
                    'name': filepath
                });
            }
            return resolve(cms_data);
        });
    });

}