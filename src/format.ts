/** source https://ourcodeworld.com/articles/read/713/converting-bytes-to-human-readable-values-kb-mb-gb-tb-pb-eb-zb-yb-with-javascript */
export function getReadableBytes(bytes: number) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const x = (bytes / Math.pow(1024, i));
    return x.toFixed(2) + ' ' + sizes[i];
}
