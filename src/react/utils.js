export function getReadableFileSizeString(fileSize) {
    let fileSizeInBytes = parseInt(fileSize);
    let i = -1;
    const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1).toString() + byteUnits[i];
}

export function getGlobalElectronProperty(propertyName) {
    let sharedObject = electron.remote.getGlobal('sharedObject');
    return sharedObject[propertyName];
}