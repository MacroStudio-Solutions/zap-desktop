const del = require("node-delete");

const useCleanCache = () => {
    const deletedFiles = del.sync(["./tmp/*"]);
    return deletedFiles;
}

module.exports = useCleanCache;