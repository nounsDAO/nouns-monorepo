const dirTree = require('directory-tree')
const R = require('ramda')
import {config} from "./index";

interface FileRecord {
    path: string;
    name: string
}

export const getImages = (): FileRecord[] => {
    const tree = dirTree(`${config.baseDir}/`, {extensions:/\.(png|jp(e)?g)$/});
    return flatten(tree.children)
}

const flatten = (dirTreeResponse: any): FileRecord[] => {
    return R.flatten(dirTreeResponse.map((item: any) => item.children ? flatten(item.children) : item))
}
