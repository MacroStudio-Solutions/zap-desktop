const del = require("node-delete");

const useCleanCache = () => {
    const deletedFiles = del.sync(["./src/tmp/*"]);
    return deletedFiles;
}

module.exports = useCleanCache;