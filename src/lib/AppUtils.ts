export const copyAttributes = (obj: any, attrs: Array<string>): any => {
    const data = {};
    attrs.forEach(attr=>{
        data[attr] = obj[attr];
    })
    return data;
}